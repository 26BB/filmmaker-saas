import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 - 100
  className?: string;
  barClassName?: string;
}

export function ProgressBar({ value, className = "", barClassName = "" }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-800/80", className)}>
      <div
        className={cn("h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300 ease-out", barClassName)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
