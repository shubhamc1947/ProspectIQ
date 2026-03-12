"use client";

import { motion } from "framer-motion";
import { Target, Zap, BarChart3, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ICP Scoring",
    description: "Instantly evaluate how well a company matches your ideal customer profile.",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Uses advanced AI to scrape, analyze, and generate actionable insights.",
  },
  {
    icon: BarChart3,
    title: "Fit Analysis",
    description: "Get detailed fit reasons, red flags, and a confidence score from 1-10.",
  },
  {
    icon: MessageSquare,
    title: "Opening Lines",
    description: "Receive personalized outreach openers tailored to each company.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center px-4 py-16">
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            About ProspectIQ
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
            ProspectIQ helps B2B sales teams quickly evaluate whether a
            company is worth pursuing — before spending time on research or outreach.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-5 card-hover"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 mb-3">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 text-center"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">How it works</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
              Paste a URL
            </span>
            <span className="hidden sm:block text-border">→</span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
              AI analyzes
            </span>
            <span className="hidden sm:block text-border">→</span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
              Get your report
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
