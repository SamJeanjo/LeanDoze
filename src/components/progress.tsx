import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  tone = "mint",
}: {
  value: number;
  tone?: "mint" | "green" | "coral" | "navy";
}) {
  const colors = {
    mint: "bg-[#7DD3C7]",
    green: "bg-[#22C55E]",
    coral: "bg-[#FB7185]",
    navy: "bg-[#0F172A]",
  };

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full transition-all duration-700", colors[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="relative grid size-28 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: `conic-gradient(#22C55E ${value * 3.6}deg, #e2e8f0 0deg)`,
        }}
      />
      <div className="relative grid size-20 place-items-center rounded-full bg-white text-center">
        <div>
          <p className="text-2xl font-semibold text-slate-950">{value}</p>
          <p className="text-[10px] font-semibold uppercase text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
