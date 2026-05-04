type ProgressRingProps = {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
};

const sizes = {
  sm: "h-24 w-24 text-2xl",
  md: "h-32 w-32 text-4xl",
  lg: "h-40 w-40 text-5xl",
};

export function ProgressRing({ value, label = "Score", size = "md", dark = false }: ProgressRingProps) {
  const score = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`ld-score-ring grid place-items-center rounded-full text-center ${sizes[size]} ${dark ? "text-white" : "text-[#07111F]"}`}
      style={{ "--score": score } as CSSProperties}
    >
      <div>
        <p className="font-semibold tracking-[-0.05em]">{score}</p>
        <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? "text-[#7DD3C7]" : "text-[#0F766E]"}`}>{label}</p>
      </div>
    </div>
  );
}
import type { CSSProperties } from "react";
