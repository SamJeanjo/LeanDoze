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

        <div className="grid grid-cols-12 gap-6 xl:items-start">
          <div className="col-span-12 space-y-6 xl:col-span-8">
            <TodayPlan plan={todayPlanMock} />
            <QuickCheckIn />
            <ProgressOverview profile={patientProfileMock} logs={dailyLogsMock} />
            <ClinicianReportPreview profile={patientProfileMock} logs={dailyLogsMock} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <TodayFocusPanel plan={todayPlanMock} />
          </div>
        </div>

        <p className="relative z-0 rounded-[28px] border border-slate-200/70 bg-white p-4 text-xs leading-5 text-slate-500 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.
        </p>
      </div>
    </PatientShell>
  );
}
