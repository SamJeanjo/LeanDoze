import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PremiumCard } from "@/components/ui/PremiumCard";

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  progress?: number;
  icon?: LucideIcon;
  tone?: "teal" | "green" | "dark" | "coral" | "amber";
};

export function MetricCard({ label, value, helper, progress, icon: Icon, tone = "teal" }: MetricCardProps) {
  return (
    <PremiumCard className="transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.09)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#64748B]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">{value}</p>
          <p className="mt-1 text-sm leading-6 text-[#64748B]">{helper}</p>
        </div>
        {Icon ? (
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/70">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {progress !== undefined ? <ProgressBar value={progress} tone={tone} className="mt-5" /> : null}
    </PremiumCard>
  );
}
