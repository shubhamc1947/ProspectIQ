"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const steps = [
  { text: "Scraping company website", icon: "🌐" },
  { text: "Extracting company data", icon: "📊" },
  { text: "Analyzing ICP fit", icon: "🎯" },
  { text: "Generating insights", icon: "✨" },
];

const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-xl border border-border bg-card p-8">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full mb-8 overflow-hidden relative">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
          />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.text}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-6 h-6 flex items-center justify-center rounded-full shrink-0">
                {i < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-5 h-5 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-accent" />
                  </motion.div>
                ) : i === currentStep ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-border" />
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  i < currentStep
                    ? "text-muted-foreground"
                    : i === currentStep
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/40"
                }`}
              >
                {step.text}
              </span>
              {i === currentStep && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm ml-auto"
                >
                  {step.icon}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingState;
