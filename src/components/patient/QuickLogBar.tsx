"use client";

import { useState } from "react";
import { Droplet, HeartPulse, Scale, Utensils } from "lucide-react";
import { QuickLogSheet } from "@/components/patient/QuickLogSheet";

const actions = [
  { label: "Weight", icon: Scale },
  { label: "Protein", icon: Utensils },
  { label: "Water", icon: Droplet },
  { label: "Symptoms", icon: HeartPulse },
];

export function QuickLogBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <section id="quick-log" className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Quick check-in</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">How are you feeling today?</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">Log the essentials in under 10 seconds.</p>
          </div>
          <span className="w-fit rounded-full bg-[#ECFEFF] px-3 py-1.5 text-xs font-bold text-[#0F766E] ring-1 ring-[#99F6E4]/70">4 taps max</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => setActive(action.label)}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-[#F8FAFC] px-3 text-sm font-semibold text-[#475569] ring-1 ring-[#E2E8F0]/80 transition duration-300 hover:-translate-y-1 hover:bg-[#ECFEFF] hover:text-[#0F766E] hover:shadow-[0_14px_30px_rgba(15,23,42,0.07)]"
            >
              <action.icon className="h-5 w-5" />
              {action.label}
            </button>
          ))}
        </div>
      </section>
      <QuickLogSheet type={active} onClose={() => setActive(null)} />
    </>
  );
}
