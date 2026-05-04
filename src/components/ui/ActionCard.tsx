"use client";

import { useState } from "react";
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
};

export function ActionCard({ title, reason, cta, progress, icon: Icon, complete = false }: ActionCardProps) {
  const [done, setDone] = useState(complete);

  return (
    <article className="group rounded-[26px] bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ring-1 ring-[#E2E8F0]/75 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]">
      <div className="flex items-start gap-3">
        <div className={done ? "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#DCFCE7] text-[#16A34A] ring-1 ring-[#BBF7D0]" : "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/80"}>
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-[#07111F]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{reason}</p>
        </div>
      </div>
      <ProgressBar value={done ? 100 : progress} tone={done ? "green" : "teal"} className="mt-5" />
      <button
        onClick={() => setDone(true)}
        className={done ? "mt-4 min-h-11 rounded-full bg-[#F0FDF4] px-5 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]" : "mt-4 min-h-11 rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5"}
      >
        {done ? "Completed" : cta}
      </button>
    </article>
  );
}
