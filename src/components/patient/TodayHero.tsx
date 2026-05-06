"use client";

import { useEffect, useState } from "react";
import { BellRing, CalendarClock, Droplet, HeartPulse, Utensils } from "lucide-react";
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
    <section className="relative z-0 overflow-hidden rounded-[32px] border border-slate-200/70 bg-[#07111F] px-5 py-7 text-white shadow-[0_28px_90px_rgba(7,17,31,0.24)] sm:px-8 sm:py-9 md:px-10">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#7DD3C7]/16 blur-3xl" />
      <div className="relative grid gap-7 xl:grid-cols-[1fr_0.78fr] xl:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="teal">Dose cycle day {plan.doseCycleDay}</StatusBadge>
            <StatusBadge tone={primaryDone >= 2 ? "success" : "teal"}>{primaryDone >= 2 ? "On track today" : "Ready for today"}</StatusBadge>
          </div>
          <p className="mt-6 text-base font-semibold text-slate-300">Good morning, {firstName}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.055em]">
            Today&apos;s GLP-1 command center.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            One focused screen for dose rhythm, hydration, protein, symptoms, and the next useful check-in.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Next dose", value: plan.nextDoseDate, icon: CalendarClock },
            { label: "Protein target", value: "120g", icon: Utensils },
            { label: "Hydration target", value: "90oz", icon: Droplet },
            { label: "Symptom check", value: "1 tap", icon: HeartPulse },
          ].map((item) => (
            <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
              <item.icon className="size-5 text-[#7DD3C7]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-[22px] border border-[#7DD3C7]/20 bg-[#7DD3C7]/10 p-4">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 size-5 shrink-0 text-[#7DD3C7]" />
              <p className="text-sm leading-6 text-slate-200">Smart reminders keep the day light: dose day, day-after-dose symptoms, hydration, and weekly report prep.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
