"use client";

import { motion } from "framer-motion";
import { Building2, CheckCircle2, AlertTriangle, MessageSquareQuote, Copy, Check } from "lucide-react";
import { useState } from "react";
import ScoreRing from "./ScoreRing";
import { Badge } from "@/components/ui/badge";

export interface AnalysisResult {
  companyName: string;
  description: string;
  industry: string;
  size: string;
  fitScore: number;
  fitReasons: string[];
  redFlags: string[];
  openingLine: string;
}

interface ResultsCardProps {
  result: AnalysisResult;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const ResultsCard = ({ result }: ResultsCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.openingLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      {/* Company Header */}
      <motion.div
        variants={item}
        className="rounded-xl border border-border bg-card p-6 card-hover"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground truncate">
                  {result.companyName}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {result.industry}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {result.size}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.description}
            </p>
          </div>
          <ScoreRing score={result.fitScore} size={96} />
        </div>
      </motion.div>

      {/* Fit Reasons & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          variants={item}
          className="rounded-xl border border-border bg-card p-5 card-hover"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/10 dark:bg-accent/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Why They Fit
            </h3>
          </div>
          <ul className="space-y-3">
            {result.fitReasons.map((reason, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                {reason}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={item}
          className="rounded-xl border border-border bg-card p-5 card-hover"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-score-mid/10 dark:bg-score-mid/20">
              <AlertTriangle className="w-3.5 h-3.5 text-score-mid" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Red Flags
            </h3>
          </div>
          <ul className="space-y-3">
            {result.redFlags.map((flag, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-score-mid mt-2 shrink-0" />
                {flag}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Opening Line */}
      <motion.div
        variants={item}
        className="rounded-xl border border-primary/20 bg-card p-5 card-hover relative overflow-hidden"
      >
        {/* Subtle shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 dark:bg-primary/20">
              <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Suggested Opener
            </h3>
          </div>
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-primary/5"
            whileTap={{ scale: 0.95 }}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </motion.button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed italic relative">
          "{result.openingLine}"
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultsCard;
