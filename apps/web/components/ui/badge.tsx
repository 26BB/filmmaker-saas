import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "published" | "draft" | "processing" | "rental" | "buy" | "amber" | "default";
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variantStyles = {
    published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    draft: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    processing: "bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse",
    rental: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    buy: "bg-amber-500/20 text-amber-400 border-amber-500/40 font-semibold",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    default: "bg-slate-800 text-slate-300 border-slate-700/60",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
