"use client";

import { useState } from "react";
import { AlertTriangle, HeartPulse } from "lucide-react";

const symptoms = ["nausea", "constipation", "fatigue", "diarrhea", "vomiting", "heartburn", "low appetite", "dizziness", "dehydration", "abdominal discomfort"];

export function SymptomLogger() {
  const [selected, setSelected] = useState<string[]>(["constipation"]);
  const severeSelected = false;

  return (
    <section id="symptoms" className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Symptom Companion</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Supportive symptom logging</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">Log what happened, when it happened, and whether you want it included for clinician review.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {symptoms.map((symptom) => {
          const active = selected.includes(symptom);
          return (
            <button
              key={symptom}
              onClick={() => setSelected(active ? selected.filter((item) => item !== symptom) : [...selected, symptom])}
              className={active ? "min-h-11 rounded-full bg-[#07111F] px-4 text-sm font-semibold text-white" : "min-h-11 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#475569] transition hover:bg-white hover:text-[#07111F]"}
            >
              {symptom}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {["mild", "moderate", "severe"].map((severity) => (
          <button key={severity} className="min-h-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm font-semibold capitalize text-[#0B1220]">
            {severity}
          </button>
        ))}
      </div>

      <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0B1220]">
        <input type="checkbox" className="h-4 w-4 accent-[#14B8A6]" defaultChecked />
        I want to mention this to my clinician
      </label>

      <div className="mt-5 rounded-2xl bg-[#FFF7ED] p-4 text-sm leading-6 text-amber-900 ring-1 ring-orange-100">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            {severeSelected
              ? "If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice."
              : "Logged symptoms can be included in your next report so you do not have to remember every detail."}
          </p>
        </div>
      </div>
    </section>
  );
}
