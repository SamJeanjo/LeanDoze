"use client";

import { useState } from "react";
import { Droplet, HeartPulse, Scale, Utensils } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Modal } from "@/components/ui/Modal";

const actions = [
  { label: "Weight", icon: Scale, value: "182.4 lb" },
  { label: "Protein", icon: Utensils, value: "64g today" },
  { label: "Water", icon: Droplet, value: "44oz today" },
  { label: "Symptoms", icon: HeartPulse, value: "10-sec check" },
];

const symptomChips = ["nausea", "constipation", "fatigue", "heartburn", "low appetite", "dizziness"];

function SheetContent({ type, onClose }: { type: string; onClose: () => void }) {
  const isSymptoms = type === "Symptoms";

  return (
    <div className="mt-5">
      {isSymptoms ? (
        <>
          <div className="flex flex-wrap gap-2">
            {symptomChips.map((chip) => (
              <button key={chip} className="min-h-11 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#334155] transition hover:bg-[#ECFEFF] hover:text-[#0F766E]">
                {chip}
              </button>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["mild", "moderate", "severe"].map((severity) => (
              <button key={severity} className="min-h-12 rounded-2xl border border-[#E2E8F0] bg-white text-sm font-semibold capitalize text-[#0B1220]">
                {severity}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#64748B]">
            If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice.
          </p>
        </>
      ) : (
        <>
          <div className="rounded-[24px] bg-[#F8FAFC] p-5 ring-1 ring-[#E2E8F0]">
            <input type="range" min="0" max="150" defaultValue="64" className="w-full accent-[#14B8A6]" />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#64748B]">0</span>
              <span className="text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">64</span>
              <span className="text-sm font-semibold text-[#64748B]">150</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["+10", "+20", "+30"].map((item) => (
              <button key={item} className="min-h-11 rounded-2xl bg-[#ECFEFF] text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4]">
                {item}
              </button>
            ))}
          </div>
        </>
      )}
      <button onClick={onClose} className="mt-6 h-12 w-full rounded-full bg-[#07111F] text-sm font-semibold text-white">
        Save log
      </button>
      <p className="mt-3 text-center text-sm font-semibold text-[#0F766E]">Logged. We&apos;ll include this in your next report.</p>
    </div>
  );
}

export function QuickCheckIn() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <section id="quick-check-in" className="rounded-[34px] bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.075)] sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Quick check-in</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Stay consistent, not perfect.</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">Log the essentials in under 10 seconds.</p>
          </div>
          <span className="w-fit rounded-full bg-[#ECFEFF] px-3 py-1.5 text-xs font-bold text-[#0F766E] ring-1 ring-[#99F6E4]/70">4 taps max</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setActive(action.label)}
                className="flex min-h-28 flex-col items-start justify-between rounded-[24px] bg-[#F8FAFC] p-4 text-left ring-1 ring-[#E2E8F0]/80 transition duration-300 hover:-translate-y-1 hover:bg-[#ECFEFF] hover:shadow-[0_16px_35px_rgba(15,23,42,0.07)] active:scale-[0.99]"
              >
                <Icon className="h-5 w-5 text-[#0F766E]" />
                <span>
                  <span className="block text-sm font-semibold text-[#07111F]">{action.label}</span>
                  <span className="mt-1 block text-xs font-medium text-[#64748B]">{action.value}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <FloatingActionButton label="Log" icon={HeartPulse} onClick={() => setActive("Symptoms")} />
      <BottomSheet open={Boolean(active)} title={active ?? ""} onClose={() => setActive(null)}>
        {active ? <SheetContent type={active} onClose={() => setActive(null)} /> : null}
      </BottomSheet>
      <Modal open={Boolean(active)} title={active ?? ""} onClose={() => setActive(null)}>
        {active ? <SheetContent type={active} onClose={() => setActive(null)} /> : null}
      </Modal>
    </>
  );
}
