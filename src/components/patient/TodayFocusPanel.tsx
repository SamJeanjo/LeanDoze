"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TodayPlanMock } from "@/lib/mockPatientData";
import { getCompletedActionsForToday, patientStateChangedEvent } from "@/lib/patientStorage";

export function TodayFocusPanel({ plan, compact = false }: { plan: TodayPlanMock; compact?: boolean }) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const primaryActionIds = useMemo(() => plan.actions.slice(0, 3).map((action) => action.id), [plan.actions]);
  const completedPrimaryActions = primaryActionIds.filter((id) => completedActions.includes(id)).length;
  const progress = Math.round((completedPrimaryActions / primaryActionIds.length) * 100);

  useEffect(() => {
    const sync = () => setCompletedActions(getCompletedActionsForToday());

    sync();
    window.addEventListener(patientStateChangedEvent, sync);

    return () => window.removeEventListener(patientStateChangedEvent, sync);
  }, []);

  return (
    <PremiumCard className={compact ? "p-5" : "lg:sticky lg:top-8"}>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/80">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F766E]">Today&apos;s focus</p>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#07111F]">Protein + hydration</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#64748B]">Low appetite days can make protein easy to miss.</p>
      <div className="mt-5 flex items-center justify-between">
        <StatusBadge tone="teal">{completedPrimaryActions} of 3 actions done</StatusBadge>
        {completedPrimaryActions === 3 ? <CheckCircle2 className="h-5 w-5 text-[#22C55E]" /> : null}
      </div>
      <ProgressBar value={progress} tone="green" className="mt-4" />
      <p className="mt-4 text-xs leading-5 text-[#64748B]">{plan.insight}</p>
    </PremiumCard>
  );
}
