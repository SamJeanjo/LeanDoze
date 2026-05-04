"use client";

import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { InsightCallout } from "@/components/ui/InsightCallout";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

const symptoms = ["nausea", "constipation", "fatigue", "diarrhea", "vomiting", "heartburn", "low appetite", "dizziness", "dehydration", "abdominal discomfort"];

export function SymptomCheckIn() {
  const [selected, setSelected] = useState("nausea");

  return (
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
      <div className="mt-6 flex flex-wrap gap-2">
        {symptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => setSelected(symptom)}
            className={selected === symptom ? "min-h-11 rounded-full bg-[#07111F] px-4 text-sm font-semibold capitalize text-white" : "min-h-11 rounded-full bg-[#F8FAFC] px-4 text-sm font-semibold capitalize text-[#475569] ring-1 ring-[#E2E8F0] transition hover:bg-[#ECFEFF] hover:text-[#0F766E]"}
          >
            {symptom}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["mild", "moderate", "severe"].map((severity) => (
          <button key={severity} className="min-h-14 rounded-2xl bg-[#F8FAFC] text-sm font-semibold capitalize text-[#07111F] ring-1 ring-[#E2E8F0] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
            {severity}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <StatusBadge tone="teal">Day 3 after dose</StatusBadge>
        <StatusBadge tone="slate">Mention to clinician</StatusBadge>
      </div>
      <div className="mt-5">
        <InsightCallout tone="cream">If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice.</InsightCallout>
      </div>
    </PremiumCard>
  );
}
