# ProspectIQ

> Paste a company URL → get an AI-powered B2B sales fit report in seconds.

ProspectIQ helps B2B sales teams instantly evaluate whether a prospect is worth pursuing — before spending time on research or outreach. Enter any company URL and receive a structured fit report with an ICP score, fit reasons, red flags, and a personalized opening line.

---

## Features

- **ICP Scoring** — 1–10 score showing how well a company matches your ideal customer profile
- **Fit Reasons** — bullet-point breakdown of why the company is or isn't a good fit
- **Red Flags** — potential deal-breakers surfaced automatically
- **Opening Lines** — personalized outreach starters tailored to each company
- **Dark / Light Mode** — system-aware theme with manual toggle
- **Contact Form** — EmailJS-powered form with no backend required

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| AI Model | Groq — Llama 3.3 70B Versatile |
| Web Scraper | Jina.ai (`r.jina.ai`) + direct HTTP fallback |
| Contact Form | EmailJS |
| Theme | next-themes |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/shubhamc1947/prospectiq.git
cd prospectiq
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Groq API (required) — free tier at console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# EmailJS (required for contact form) — free tier at emailjs.com
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_USER_ID=your_public_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Groq API key for LLM inference | Yes |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID | Yes (contact form) |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Yes (contact form) |
| `NEXT_PUBLIC_EMAILJS_USER_ID` | EmailJS public key | Yes (contact form) |

Get your Groq API key for free at [console.groq.com](https://console.groq.com).
Set up EmailJS at [emailjs.com](https://www.emailjs.com).

---

## How It Works

```
User pastes URL
      ↓
Jina.ai scrapes the page (r.jina.ai/{url})
      ↓ (fallback if Jina times out)
Direct HTTP fetch + HTML tag stripping
      ↓
Groq (Llama 3.3 70B) analyzes the content
      ↓
Structured JSON report returned
      ↓
Results displayed: score, reasons, red flags, opener
```

The API route lives at `src/app/api/analyze/route.ts` and handles everything server-side — no separate backend needed.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # Core API — scrape + Groq LLM
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx                # Home / analyzer
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── AnalyzerInput.tsx       # URL + context input form
│   ├── ResultsCard.tsx         # Fit report display
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   └── Providers.tsx
└── lib/
    └── utils.ts
```

---

## Deployment

Deploy instantly to Vercel:

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

---

## License

MIT
