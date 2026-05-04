import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ClinicianReportPreview } from "@/components/patient/ClinicianReportPreview";
import { PatientShell } from "@/components/patient/PatientShell";
import { ProgressOverview } from "@/components/patient/ProgressOverview";
import { QuickCheckIn } from "@/components/patient/QuickCheckIn";
import { TodayFocusPanel } from "@/components/patient/TodayFocusPanel";
import { TodayHero } from "@/components/patient/TodayHero";
import { TodayPlan } from "@/components/patient/TodayPlan";
import { getOrCreateCurrentUser } from "@/lib/app-data";
import { dailyLogsMock, patientProfileMock, todayPlanMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default async function PatientTodayPage() {
  const { user } = await getOrCreateCurrentUser();

  if (user.role === UserRole.CLINIC_ADMIN || user.role === UserRole.CLINIC_STAFF || user.memberships.length > 0) {
    redirect("/clinic/dashboard");
  }

  const firstName = user.firstName || patientProfileMock.name.split(" ")[0] || "Sam";

  return (
    <PatientShell active="today">
      <div className="ld-page-enter space-y-6">
        <TodayHero firstName={firstName} plan={todayPlanMock} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="space-y-6">
            <TodayPlan plan={todayPlanMock} />
            <QuickCheckIn />
            <ProgressOverview profile={patientProfileMock} logs={dailyLogsMock} />
            <ClinicianReportPreview profile={patientProfileMock} logs={dailyLogsMock} />
          </div>
          <TodayFocusPanel plan={todayPlanMock} />
        </div>

        <p className="rounded-2xl bg-white/85 p-4 text-xs leading-5 text-[#64748B] ring-1 ring-[#E2E8F0]/80">
          LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.
        </p>
      </div>
    </PatientShell>
  );
}
