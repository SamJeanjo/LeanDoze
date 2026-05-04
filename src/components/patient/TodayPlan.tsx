"use client";

import { useState } from "react";
import { ChevronDown, Droplet, Dumbbell, HeartPulse, Salad, Utensils } from "lucide-react";
import { ActionCard } from "@/components/ui/ActionCard";
import type { TodayAction, TodayPlanMock } from "@/lib/mockPatientData";

const icons = {
  "protein-first": Utensils,
  "hydrate-early": Droplet,
  "log-symptoms": HeartPulse,
  strength: Dumbbell,
  "meal-prep": Salad,
};

function actionIcon(action: TodayAction) {
  return icons[action.id as keyof typeof icons] ?? HeartPulse;
}

export function TodayPlan({ plan }: { plan: TodayPlanMock }) {
  const [expanded, setExpanded] = useState(false);
  const visibleActions = expanded ? plan.actions : plan.actions.slice(0, 3);
  const hiddenCount = Math.max(0, plan.actions.length - 3);

  return (
    <section className="relative z-0 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">Today&apos;s LeanDoze Plan</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#07111F]">Today, focus on what matters most.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-600">Small check-ins make your report easier.</p>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-4">
        {visibleActions.map((action) => (
          <div key={action.id} className="col-span-12 xl:col-span-4">
            <ActionCard title={action.title} reason={action.reason} cta={action.cta} progress={action.progress} icon={actionIcon(action)} complete={action.state === "complete"} />
          </div>
        ))}
      </div>
      {hiddenCount ? (
        <button
          onClick={() => setExpanded((value) => !value)}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-200"
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more suggestions`}
          <ChevronDown className={expanded ? "h-4 w-4 rotate-180 transition" : "h-4 w-4 transition"} />
        </button>
      ) : null}
    </section>
  );
}
