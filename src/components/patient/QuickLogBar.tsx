"use client";

import { useState } from "react";
import { Activity, Apple, Droplet, HeartPulse, Pill, Scale, Smile, Utensils } from "lucide-react";
import { QuickLogSheet } from "@/components/patient/QuickLogSheet";

const actions = [
  { label: "Weight", icon: Scale },
  { label: "Dose", icon: Pill },
  { label: "Protein", icon: Utensils },
  { label: "Water", icon: Droplet },
  { label: "Symptoms", icon: HeartPulse },
  { label: "Meal", icon: Apple },
  { label: "Activity", icon: Activity },
  { label: "Mood/Energy", icon: Smile },
];

export function QuickLogBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <section id="quick-log" className="sticky bottom-20 z-40 rounded-[28px] border border-[#E2E8F0]/80 bg-white/94 p-3 shadow-[0_22px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:bottom-6">
        <div className="flex gap-2 overflow-x-auto">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => setActive(action.label)}
              className="flex min-h-16 min-w-[86px] flex-col items-center justify-center gap-1 rounded-2xl bg-[#F8FAFC] px-3 text-xs font-semibold text-[#475569] ring-1 ring-[#E2E8F0] transition hover:-translate-y-0.5 hover:bg-[#ECFEFF] hover:text-[#0F766E]"
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
