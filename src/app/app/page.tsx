import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { DoctorReportPreview } from "@/components/patient/DoctorReportPreview";
import { DoseCycleTimeline } from "@/components/patient/DoseCycleTimeline";
import { MuscleProtectionCard } from "@/components/patient/MuscleProtectionCard";
import { PatientAppShell } from "@/components/patient/PatientAppShell";
import { QuickLogBar } from "@/components/patient/QuickLogBar";
import { SymptomLogger } from "@/components/patient/SymptomLogger";
import { TodayPlanHero } from "@/components/patient/TodayPlanHero";
import { getOrCreateCurrentUser } from "@/lib/app-data";
import { dailyLogsMock, patientProfileMock, todayPlanMock } from "@/lib/mockPatientData";
import { hydrationAdherence, proteinAdherence, weightChange } from "@/lib/patientInsights";

export const dynamic = "force-dynamic";

export default async function PatientTodayPage() {
  const { user } = await getOrCreateCurrentUser();

  if (user.role === UserRole.CLINIC_ADMIN || user.role === UserRole.CLINIC_STAFF || user.memberships.length > 0) {
    redirect("/clinic/dashboard");
  }

  const firstName = user.firstName || patientProfileMock.name.split(" ")[0] || "Emma";
  const latestLog = dailyLogsMock[dailyLogsMock.length - 1];

  return (
    <PatientAppShell active="today">
      <div className="space-y-6">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Patient OS</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#07111F] sm:text-6xl">
              Good morning, {firstName}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#ECFEFF] px-3 py-1.5 text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4]">
                Day {todayPlanMock.doseCycleDay} of your dose cycle
              </span>
              <span className="rounded-full bg-[#F0FDF4] px-3 py-1.5 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]">
                You&apos;re on track this week.
              </span>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#475569]">
              LeanDoze helps you know what to do today based on your dose cycle, symptoms, protein, hydration, and progress.
            </p>
          </div>
          <div className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B]">Today&apos;s priority</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Protein + hydration</p>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">{todayPlanMock.insight}</p>
          </div>
        </section>

        <TodayPlanHero plan={todayPlanMock} />
        <QuickLogBar />

        <section id="nutrition" className="grid gap-4 md:grid-cols-3">
          {[
            ["Protein", `${latestLog.proteinGrams}g`, `${proteinAdherence(dailyLogsMock, patientProfileMock.proteinGoal)}% weekly adherence`, "#22C55E"],
            ["Hydration", `${latestLog.hydrationOz}oz`, `${hydrationAdherence(dailyLogsMock, patientProfileMock.hydrationGoal)}% weekly adherence`, "#14B8A6"],
            ["Weight progress", `${weightChange(patientProfileMock)} lb`, `${patientProfileMock.currentWeight} lb current`, "#0F172A"],
          ].map(([label, value, helper, color]) => (
            <article key={label} className="rounded-[26px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.055)]">
              <p className="text-sm font-medium text-[#64748B]">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">{value}</p>
              <p className="mt-1 text-sm text-[#64748B]">{helper}</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]/80">
                <div className="h-full rounded-full" style={{ width: label === "Weight progress" ? "62%" : label === "Protein" ? "76%" : "72%", backgroundColor: color }} />
              </div>
            </article>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="space-y-6">
            <DoseCycleTimeline profile={patientProfileMock} plan={todayPlanMock} />
            <SymptomLogger />
          </div>
          <div className="space-y-6">
            <MuscleProtectionCard profile={patientProfileMock} logs={dailyLogsMock} />
            <DoctorReportPreview profile={patientProfileMock} logs={dailyLogsMock} />
          </div>
        </div>

        <p className="rounded-2xl bg-white p-4 text-xs leading-5 text-[#64748B] ring-1 ring-[#E2E8F0]">
          LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.
        </p>
      </div>
    </PatientAppShell>
  );
}
