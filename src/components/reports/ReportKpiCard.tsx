import type { LucideIcon } from "lucide-react";

type ReportKpiCardProps = {
  label: string;
  value: string;
  trend: string;
  status: string;
  icon: LucideIcon;
  tone?: "navy" | "teal" | "green" | "amber" | "coral";
  sparkline?: number[];
};

const toneClasses = {
  navy: "bg-[#0F172A] text-white",
  teal: "bg-[#ECFEFF] text-[#0F766E]",
  green: "bg-[#F0FDF4] text-[#15803D]",
  amber: "bg-amber-50 text-amber-700",
  coral: "bg-rose-50 text-[#BE123C]",
};

export function ReportKpiCard({ label, value, trend, status, icon: Icon, tone = "teal", sparkline = [28, 34, 31, 45, 42, 52, 58] }: ReportKpiCardProps) {
  const max = Math.max(...sparkline, 1);

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(15,23,42,0.09)]">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#050816]">{value}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0F766E]">{trend}</p>
          <p className="mt-1 text-xs text-[#64748B]">{status}</p>
        </div>
        <div className="flex h-9 w-24 items-end gap-1">
          {sparkline.map((point, index) => (
            <span
              key={`${point}-${index}`}
              className="flex-1 rounded-t-full bg-[#14B8A6]/25 transition group-hover:bg-[#14B8A6]/45"
              style={{ height: `${Math.max(18, (point / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
