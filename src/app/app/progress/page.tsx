import { PageHeader } from "@/components/ui/PageHeader";
import { PatientShell } from "@/components/patient/PatientShell";
import { ProgressOverview } from "@/components/patient/ProgressOverview";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientProgressPage() {
  return (
    <PatientShell active="progress">
      <div className="ld-page-enter space-y-6">
        <PageHeader eyebrow="Progress" title="Progress that feels human." description="Weight is only one part of the story. Track wins that keep you going when the scale is quiet." />
        <ProgressOverview profile={patientProfileMock} logs={dailyLogsMock} full />
      </div>
    </PatientShell>
  );
}
