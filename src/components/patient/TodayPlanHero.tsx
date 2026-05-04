"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Droplet, Dumbbell, HeartPulse, Salad, Utensils } from "lucide-react";
import type { TodayAction, TodayPlanMock } from "@/lib/mockPatientData";

const icons = {
  "protein-first": Utensils,
  "hydrate-early": Droplet,
  "log-symptoms": HeartPulse,
  strength: Dumbbell,
  "meal-prep": Salad,
};

function ActionCard({ action }: { action: TodayAction }) {
  const [done, setDone] = useState(action.state === "complete");
  const Icon = icons[action.id as keyof typeof icons] ?? CheckCircle2;

  return (
    <article className="group rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)]">
      <div className="flex items-start gap-3">
        <div className={done ? "grid h-11 w-11 place-items-center rounded-2xl bg-[#DCFCE7] text-[#16A34A] ring-1 ring-[#BBF7D0]" : "grid h-11 w-11 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]"}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold tracking-[-0.02em] text-[#07111F]">{action.title}</h3>
            {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" /> : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{action.reason}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={done ? "h-full rounded-full bg-gradient-to-r from-[#14B8A6] to-[#22C55E]" : "h-full rounded-full bg-gradient-to-r from-[#14B8A6] to-[#22C55E]"} style={{ width: `${done ? 100 : action.progress}%` }} />
          </div>
          <button
            onClick={() => setDone(true)}
            className={done ? "mt-4 h-10 rounded-full bg-[#F0FDF4] px-4 text-sm font-semibold text-[#15803D]" : "mt-4 h-10 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"}
          >
            {done ? "Completed" : action.cta}
          </button>
        </div>
      </div>
    </article>
  );
}

export function TodayPlanHero({ plan }: { plan: TodayPlanMock }) {
  const [expanded, setExpanded] = useState(false);
  const visibleActions = expanded ? plan.actions : plan.actions.slice(0, 3);
  const hiddenCount = Math.max(0, plan.actions.length - 3);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Today&apos;s LeanDoze Plan</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#07111F] sm:text-4xl">Stay consistent, not perfect.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">Three simple things matter most today. Everything else can wait.</p>
        </div>
        <div className="rounded-2xl bg-[#FFF7ED] px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-orange-100/70">
          Day {plan.doseCycleDay}: {plan.priority}
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 lg:grid-cols-3">
        {visibleActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>

      {hiddenCount ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-200"
        >
          {expanded ? "Show less" : `+ ${hiddenCount} more`}
          <ChevronDown className={expanded ? "h-4 w-4 rotate-180 transition" : "h-4 w-4 transition"} />
        </button>
      ) : null}
    </section>
  );
}
