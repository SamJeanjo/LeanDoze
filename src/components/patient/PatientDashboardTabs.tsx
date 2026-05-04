"use client";

import { useState } from "react";
import { DoctorReportPreview } from "@/components/patient/DoctorReportPreview";
import { DoseCycleTimeline } from "@/components/patient/DoseCycleTimeline";
import { MuscleProtectionCard } from "@/components/patient/MuscleProtectionCard";
import { QuickLogBar } from "@/components/patient/QuickLogBar";
import { SymptomLogger } from "@/components/patient/SymptomLogger";
import { TodayPlanHero } from "@/components/patient/TodayPlanHero";
import type { DailyLogMock, PatientProfileMock, TodayPlanMock } from "@/lib/mockPatientData";
import { hydrationAdherence, proteinAdherence, weightChange } from "@/lib/patientInsights";

const tabs = ["Today", "Progress", "Body", "Insights", "Reports"] as const;
type Tab = (typeof tabs)[number];

export function PatientDashboardTabs({ profile, logs, plan }: { profile: PatientProfileMock; logs: DailyLogMock[]; plan: TodayPlanMock }) {
  const [active, setActive] = useState<Tab>("Today");
  const latestLog = logs[logs.length - 1];

  return (
    <div className="space-y-6">
      <nav className="sticky top-16 z-30 flex gap-2 overflow-x-auto rounded-3xl bg-white/90 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:top-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={
              active === tab
                ? "min-h-11 shrink-0 rounded-2xl bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(7,17,31,0.18)]"
                : "min-h-11 shrink-0 rounded-2xl px-5 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#07111F]"
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      {active === "Today" ? (
        <div className="space-y-6">
          <TodayPlanHero plan={plan} />
          <QuickLogBar />
          <p className="rounded-2xl bg-white p-4 text-sm leading-6 text-[#64748B] shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
            Tiny steps count. Stay consistent, not perfect.
          </p>
        </div>
      ) : null}

      {active === "Progress" ? (
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Protein", `${latestLog.proteinGrams}g`, `${proteinAdherence(logs, profile.proteinGoal)}% weekly adherence`, "#22C55E"],
            ["Hydration", `${latestLog.hydrationOz}oz`, `${hydrationAdherence(logs, profile.hydrationGoal)}% weekly adherence`, "#14B8A6"],
            ["Weight progress", `${weightChange(profile)} lb`, `${profile.currentWeight} lb current`, "#0F172A"],
          ].map(([label, value, helper, color]) => (
            <article key={label} className="rounded-3xl bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-medium text-[#64748B]">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">{value}</p>
              <p className="mt-1 text-sm text-[#64748B]">{helper}</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]/80">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: label === "Weight progress" ? "62%" : label === "Protein" ? "76%" : "72%", backgroundColor: color }} />
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {active === "Body" ? <MuscleProtectionCard profile={profile} logs={logs} /> : null}

      {active === "Insights" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <DoseCycleTimeline profile={profile} plan={plan} />
          <SymptomLogger />
        </div>
      ) : null}

      {active === "Reports" ? <DoctorReportPreview profile={profile} logs={logs} /> : null}
    </div>
  );
}
