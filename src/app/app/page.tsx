import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { PatientAppShell } from "@/components/patient/PatientAppShell";
import { PatientDashboardTabs } from "@/components/patient/PatientDashboardTabs";
import { getOrCreateCurrentUser } from "@/lib/app-data";
import { dailyLogsMock, patientProfileMock, todayPlanMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default async function PatientTodayPage() {
  const { user } = await getOrCreateCurrentUser();

  if (user.role === UserRole.CLINIC_ADMIN || user.role === UserRole.CLINIC_STAFF || user.memberships.length > 0) {
    redirect("/clinic/dashboard");
  }

  const firstName = user.firstName || patientProfileMock.name.split(" ")[0] || "Emma";

  return (
    <PatientAppShell active="today">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_26px_80px_rgba(15,23,42,0.075)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#7DD3C7]/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#ECFEFF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#0F766E] ring-1 ring-[#99F6E4]/70">
                Day {todayPlanMock.doseCycleDay} of your dose cycle
              </span>
              <span className="rounded-full bg-[#F0FDF4] px-3 py-1.5 text-xs font-bold text-[#15803D] ring-1 ring-[#BBF7D0]">
                You&apos;re on track
              </span>
            </div>
            <p className="mt-6 text-lg font-semibold text-[#64748B]">Good morning, {firstName}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#07111F] sm:text-6xl">
              Your GLP-1 day, simplified.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#475569] sm:text-lg sm:leading-8">
              Today is a protein + hydration priority day. Stay consistent, not perfect.
            </p>
          </div>
        </section>

        <PatientDashboardTabs profile={patientProfileMock} logs={dailyLogsMock} plan={todayPlanMock} />

        <p className="rounded-2xl bg-white p-4 text-xs leading-5 text-[#64748B] ring-1 ring-[#E2E8F0]">
          LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.
        </p>
      </div>
    </PatientAppShell>
  );
}
