"use client";

import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { QuickCheckInContent } from "@/components/patient/QuickCheckIn";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { InsightCallout } from "@/components/ui/InsightCallout";
import { Modal } from "@/components/ui/Modal";
import { PremiumCard } from "@/components/ui/PremiumCard";

export function SymptomCheckIn() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PremiumCard id="symptoms" className="p-5 sm:p-6 lg:p-8">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/80">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Symptom companion</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">How are you feeling today?</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Keep it simple. If something matters, LeanDoze will include it in your next report.</p>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Start symptom check-in
      </button>
      <div className="mt-5">
        <InsightCallout tone="cream">If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice.</InsightCallout>
      </div>
      </PremiumCard>
      <BottomSheet open={open} title="Symptoms" onClose={() => setOpen(false)}>
        <QuickCheckInContent type="Symptoms" onClose={() => setOpen(false)} onSaved={() => undefined} />
      </BottomSheet>
      <Modal open={open} title="Symptoms" onClose={() => setOpen(false)}>
        <QuickCheckInContent type="Symptoms" onClose={() => setOpen(false)} onSaved={() => undefined} />
      </Modal>
    </>
  );
}
