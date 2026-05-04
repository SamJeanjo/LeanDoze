import { DoseCycle } from "@/components/patient/DoseCycle";
import { PatientShell } from "@/components/patient/PatientShell";
import { SymptomCheckIn } from "@/components/patient/SymptomCheckIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { dailyLogsMock, patientProfileMock, todayPlanMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientInsightsPage() {
  const symptomDays = dailyLogsMock.filter((log) => log.symptoms.length).length;

  return (
    <PatientShell active="today">
      <div className="ld-page-enter space-y-6">
        <PageHeader eyebrow="Insights" title="Understand your dose rhythm." description="See soft patterns around appetite, symptoms, medication timing, and what may be worth mentioning next visit." />
        <DoseCycle profile={patientProfileMock} plan={todayPlanMock} />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SymptomCheckIn />
          <PremiumCard>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Pattern snapshot</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">{symptomDays} symptom days logged</h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">LeanDoze keeps this organized so you can review patterns with your clinician.</p>
          </PremiumCard>
        </div>
      </div>
    </PatientShell>
  );
}
