type ProgressBarProps = {
  value: number;
  tone?: "teal" | "green" | "dark" | "coral" | "amber";
  className?: string;
};

const tones = {
  teal: "bg-[#14B8A6]",
  green: "bg-[#22C55E]",
  dark: "bg-[#07111F]",
  coral: "bg-[#FB7185]",
  amber: "bg-[#F59E0B]",
};

export function ProgressBar({ value, tone = "teal", className = "" }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 overflow-hidden rounded-full bg-[#E2E8F0]/80 ${className}`}>
      <div className={`ld-progress h-full origin-left rounded-full ${tones[tone]}`} style={{ width: `${width}%` }} />
    </div>
  );
}
