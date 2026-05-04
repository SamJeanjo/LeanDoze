"use client";

import { CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

type ActionCardProps = {
  title: string;
  reason: string;
  cta: string;
  progress: number;
  icon: LucideIcon;
  complete?: boolean;
  onAction?: () => void;
};

export function ActionCard({ title, reason, cta, progress, icon: Icon, complete = false, onAction }: ActionCardProps) {
  return (
    <article className="group relative z-0 rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)]">
      <div className="flex items-start gap-4">
        <div className={complete ? "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#DCFCE7] text-[#16A34A] ring-1 ring-[#BBF7D0]" : "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/80"}>
          {complete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-[-0.015em] text-[#07111F]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{reason}</p>
        </div>
      </div>
      <ProgressBar value={complete ? 100 : progress} tone={complete ? "green" : "teal"} className="mt-5" />
      <button
        onClick={onAction}
        disabled={complete}
        className={complete ? "mt-4 min-h-11 rounded-full bg-[#F0FDF4] px-5 py-2.5 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]" : "mt-4 min-h-11 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"}
      >
        {complete ? "Done" : cta}
      </button>
    </article>
  );
}
