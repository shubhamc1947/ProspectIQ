"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AnalyzerInputProps {
  onAnalyze: (url: string, context: string) => void;
  isLoading: boolean;
}

const AnalyzerInput = ({ onAnalyze, isLoading }: AnalyzerInputProps) => {
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [urlFocused, setUrlFocused] = useState(false);
  const [contextFocused, setContextFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim(), context.trim());
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* URL input */}
        <motion.div
          className={`flex items-center gap-2 rounded-xl border bg-card p-1.5 transition-all duration-300 ${
            urlFocused
              ? "border-primary/50 glow-primary"
              : "border-border hover:border-muted-foreground/30"
          }`}
          layout
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
            <Globe className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="url"
            placeholder="https://company.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setUrlFocused(true)}
            onBlur={() => setUrlFocused(false)}
            className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            disabled={isLoading}
            required
          />
        </motion.div>

        {/* Context input — always visible */}
        <motion.div
          className={`flex items-center gap-2 rounded-xl border bg-card p-1.5 transition-all duration-300 ${
            contextFocused
              ? "border-primary/50 glow-primary"
              : "border-border hover:border-muted-foreground/30"
          }`}
          layout
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="What are you selling? e.g. AI-powered HRMS for mid-market companies"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setContextFocused(true)}
            onBlur={() => setContextFocused(false)}
            className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            disabled={isLoading}
          />
        </motion.div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full rounded-xl h-11 font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Analyze Fit
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AnalyzerInput;
