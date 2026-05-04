"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TodayPlanMock } from "@/lib/mockPatientData";
import { getCompletedActionsForToday, patientStateChangedEvent } from "@/lib/patientStorage";

export function TodayHero({ firstName, plan }: { firstName: string; plan: TodayPlanMock }) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const primaryDone = plan.actions.slice(0, 3).filter((action) => completedActions.includes(action.id)).length;

  useEffect(() => {
    const sync = () => setCompletedActions(getCompletedActionsForToday());

    sync();
    window.addEventListener(patientStateChangedEvent, sync);

    return () => window.removeEventListener(patientStateChangedEvent, sync);
  }, []);

  return (
    <section className="relative z-0 overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-white via-white to-[#E6FFFA] px-5 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:px-8 sm:py-10 md:px-10 md:py-12">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="teal">Day {plan.doseCycleDay} of your dose cycle</StatusBadge>
          <StatusBadge tone={primaryDone >= 2 ? "success" : "teal"}>{primaryDone >= 2 ? "You're on track today" : "Ready for today"}</StatusBadge>
        </div>
        <p className="mt-6 text-base font-semibold text-slate-600">Good morning, {firstName}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#07111F] sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.055em]">
          Your GLP-1 day, simplified.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          Today, focus on protein, hydration, and one quick check-in.
        </p>
      </div>
    </section>
  );
}
