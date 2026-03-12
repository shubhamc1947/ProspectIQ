import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// ─── Config ────────────────────────────────────────────────────────────────
const PAGE_CONTENT_MAX_CHARS = 12_000;
const PAGE_CONTENT_MIN_CHARS = 100;
const JINA_TIMEOUT_MS = 25_000;
const DIRECT_TIMEOUT_MS = 15_000;

// ─── Groq client ───────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Prompt ────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a B2B sales intelligence analyst. Analyze company websites and return a structured ICP (Ideal Customer Profile) fit assessment.

Always respond with valid JSON only — no markdown, no explanation outside the JSON. The JSON must match this exact structure:
{
  "companyName": "string",
  "description": "2-3 sentence summary of what the company does, their size, and market",
  "industry": "concise industry label (e.g. 'SaaS / HR Tech')",
  "size": "employee range (e.g. '50-200 employees' or 'Enterprise 1000+')",
  "fitScore": integer from 1 to 10,
  "fitReasons": ["reason 1", "reason 2", "reason 3"],
  "redFlags": ["red flag 1", "red flag 2"],
  "openingLine": "a personalized, specific cold outreach opening line referencing something real about the company"
}`;

// ─── Scraper helpers ───────────────────────────────────────────────────────

async function scrapeWithJina(url: string): Promise<string | null> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  console.log(`[SCRAPER] Trying Jina.ai: ${jinaUrl}`);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), JINA_TIMEOUT_MS);
    const resp = await fetch(jinaUrl, {
      headers: { Accept: "text/plain", "X-No-Cache": "true" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) {
      console.warn(`[SCRAPER] Jina.ai returned ${resp.status}`);
      return null;
    }
    const text = (await resp.text()).trim();
    console.log(`[SCRAPER] Jina.ai OK — ${text.length} chars`);
    return text;
  } catch (e: any) {
    console.warn(`[SCRAPER] Jina.ai failed (${e?.name ?? e})`);
    return null;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function scrapeDirectly(url: string): Promise<string | null> {
  console.log(`[SCRAPER] Falling back to direct scrape: ${url}`);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DIRECT_TIMEOUT_MS);
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ProspectIQBot/1.0)" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) return null;
    const html = await resp.text();
    const text = stripHtml(html);
    console.log(`[SCRAPER] Direct scrape OK — ${text.length} chars`);
    return text;
  } catch (e: any) {
    console.warn(`[SCRAPER] Direct scrape failed (${e?.name ?? e})`);
    return null;
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let url: string;
  let context: string;

  try {
    const body = await req.json();
    url = (body.url ?? "").trim();
    context = (body.context ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 422 });
  }

  console.log(`\n[ANALYZE] ▶ url=${url} | context='${context.slice(0, 60)}'`);

  // Step 1 — Scrape
  let pageContent = await scrapeWithJina(url);

  if (!pageContent || pageContent.length < PAGE_CONTENT_MIN_CHARS) {
    pageContent = await scrapeDirectly(url);
  }

  if (!pageContent || pageContent.length < PAGE_CONTENT_MIN_CHARS) {
    console.error(`[SCRAPER] Both methods failed for ${url}`);
    return NextResponse.json(
      { error: "Could not fetch page content — URL may be blocked or unavailable" },
      { status: 502 }
    );
  }

  // Step 2 — Groq analysis
  const productContext = context ? `\n\nProduct/service context: ${context}` : "";
  const userPrompt = `Analyze this company for B2B sales fit.

Company URL: ${url}${productContext}

Website content:
${pageContent.slice(0, PAGE_CONTENT_MAX_CHARS)}

Return the JSON analysis.`;

  console.log(`[GROQ] Sending request — content: ${pageContent.length} chars`);

  let rawJson: string;
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });
    rawJson = completion.choices[0].message.content?.trim() ?? "";
    console.log(`[GROQ] Response received | finish_reason: ${completion.choices[0].finish_reason}`);
  } catch (e: any) {
    console.error(`[GROQ] API error:`, e?.message ?? e);
    return NextResponse.json({ error: `Groq API error: ${e?.message ?? "unknown"}` }, { status: 502 });
  }

  // Strip markdown fences if model wrapped the JSON
  if (rawJson.startsWith("```")) {
    const lines = rawJson.split("\n");
    rawJson = lines.slice(1, lines[lines.length - 1] === "```" ? -1 : undefined).join("\n");
    console.log(`[GROQ] Stripped markdown fences`);
  }

  // Step 3 — Parse & validate
  let data: any;
  try {
    data = JSON.parse(rawJson);
  } catch (e: any) {
    console.error(`[GROQ] JSON parse failed: ${e?.message}\nRaw: ${rawJson.slice(0, 500)}`);
    return NextResponse.json({ error: "Model returned invalid JSON — please retry" }, { status: 502 });
  }

  data.fitScore = Math.max(1, Math.min(10, parseInt(data.fitScore ?? "5", 10)));
  console.log(`[ANALYZE] ✓ Done — ${data.companyName} | score: ${data.fitScore}`);

  return NextResponse.json(data);
}
