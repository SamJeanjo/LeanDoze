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
    <section className="rounded-[34px] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.075)] sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Today&apos;s LeanDoze Plan</p>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#07111F]">Today, focus on what matters most.</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#64748B]">Small check-ins make your report easier.</p>
      </div>
      <div className="mt-6 grid gap-3 xl:grid-cols-3">
        {visibleActions.map((action) => (
          <ActionCard key={action.id} title={action.title} reason={action.reason} cta={action.cta} progress={action.progress} icon={actionIcon(action)} complete={action.state === "complete"} />
        ))}
      </div>
      {hiddenCount ? (
        <button
          onClick={() => setExpanded((value) => !value)}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F766E] ring-1 ring-[#E2E8F0] transition hover:-translate-y-0.5 hover:bg-[#ECFEFF]"
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more suggestions`}
          <ChevronDown className={expanded ? "h-4 w-4 rotate-180 transition" : "h-4 w-4 transition"} />
        </button>
      ) : null}
    </section>
  );
}
