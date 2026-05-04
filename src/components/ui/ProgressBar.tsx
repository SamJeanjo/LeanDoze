type ProgressBarProps = {
  value: number;
  tone?: "teal" | "green" | "dark" | "coral" | "amber";
  className?: string;
};

const tones = {
  teal: "bg-gradient-to-r from-[#14B8A6] to-[#22C55E]",
  green: "bg-gradient-to-r from-[#14B8A6] to-[#22C55E]",
  dark: "bg-[#07111F]",
  coral: "bg-[#FB7185]",
  amber: "bg-[#F59E0B]",
};

export function ProgressBar({ value, tone = "teal", className = "" }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className={`ld-progress h-full origin-left rounded-full transition-all duration-700 ease-out ${tones[tone]}`} style={{ width: `${width}%` }} />
    </div>
  );
}
