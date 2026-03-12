"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
}

const ScoreRing = ({ score, size = 96 }: ScoreRingProps) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  const getColor = () => {
    if (score >= 7) return "hsl(var(--score-high))";
    if (score >= 4) return "hsl(var(--score-mid))";
    return "hsl(var(--score-low))";
  };

  const getLabel = () => {
    if (score >= 8) return "Strong Fit";
    if (score >= 6) return "Good Fit";
    if (score >= 4) return "Moderate";
    return "Weak Fit";
  };

  const getGlow = () => {
    if (score >= 7) return "drop-shadow(0 0 6px hsl(var(--score-high) / 0.4))";
    if (score >= 4) return "drop-shadow(0 0 6px hsl(var(--score-mid) / 0.4))";
    return "drop-shadow(0 0 6px hsl(var(--score-low) / 0.4))";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ filter: getGlow() }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold tabular-nums"
            style={{ color: getColor() }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <motion.span
        className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {getLabel()}
      </motion.span>
    </div>
  );
};

export default ScoreRing;
