"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Zap } from "lucide-react";
import AnalyzerInput from "@/components/AnalyzerInput";
import LoadingState from "@/components/LoadingState";
import ResultsCard, { type AnalysisResult } from "@/components/ResultsCard";
import HeroAnimation from "@/components/HeroAnimation";
import { Button } from "@/components/ui/button";

const demoResult: AnalysisResult = {
  companyName: "Acme Corp",
  description:
    "Acme Corp is a mid-market SaaS company providing cloud-based project management and team collaboration tools for engineering teams. They serve over 2,000 customers across North America and Europe.",
  industry: "SaaS / Project Management",
  size: "200-500 employees",
  fitScore: 8,
  fitReasons: [
    "Mid-market SaaS company aligns perfectly with your target segment",
    "Active engineering team likely needs automation tooling",
    "Recent Series B funding suggests budget for new tools",
  ],
  redFlags: [
    "May already use a competing solution (Jira ecosystem detected)",
    "European HQ could mean longer sales cycles due to procurement",
  ],
  openingLine:
    "Hey — noticed your engineering team at Acme just shipped a major platform update. Curious if you've looked at automating the QA feedback loop that usually slows down releases like that?",
};

export default function HomePage() {
  const [state, setState] = useState<"idle" | "loading" | "results">("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleAnalyze = async (url: string, context: string) => {
    setState("loading");
    setError(null);
    try {
      // Same-origin API call — no CORS, no env vars needed
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, context }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${resp.status}`);
      }
      const data: AnalysisResult = await resp.json();
      setResult(data);
      setState("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setState("idle");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
  };

  const handleTryDemo = () => {
    setResult(demoResult);
    setState("results");
  };

  return (
    <div
      className="min-h-[calc(100vh-7rem)] flex flex-col items-center px-4 py-12 relative overflow-hidden spotlight"
      onMouseMove={handleMouseMove}
    >
      {/* Dot grid background */}
      <div className="fixed inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Ambient glow blobs */}
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Main content */}
      <div className="w-full flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col items-center relative"
            >
              <div className="absolute inset-0 -top-20 -bottom-20 overflow-hidden">
                <HeroAnimation />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6 relative z-10"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  <Zap className="w-3 h-3" />
                  AI-Powered Sales Intelligence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-center mb-3 leading-tight relative z-10"
              >
                Know if they&apos;re a fit
                <br />
                <span className="text-primary">before you reach out</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-muted-foreground text-base max-w-md mx-auto text-center mb-10 relative z-10"
              >
                Paste a company URL. Get a fit score, red flags, and a personalized opener — in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full relative z-10"
              >
                <AnalyzerInput onAnalyze={handleAnalyze} isLoading={false} />
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-red-500 text-center relative z-10"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={handleTryDemo}
                className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1.5 relative z-10"
              >
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
                See a demo analysis
              </motion.button>
            </motion.div>
          )}

          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center"
            >
              <LoadingState />
            </motion.div>
          )}

          {state === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="flex items-center justify-end max-w-2xl mx-auto mb-5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground gap-1.5 transition-all duration-200 hover:border-primary/30"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Analysis
                </Button>
              </div>
              <ResultsCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
