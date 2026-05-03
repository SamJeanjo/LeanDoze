import { ProgressTimeline } from "@/components/patient/ProgressTimeline";
import { PatientAppShell } from "@/components/patient/PatientAppShell";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientProgressPage() {
  return (
    <PatientAppShell active="progress">
      <ProgressTimeline profile={patientProfileMock} logs={dailyLogsMock} />
    </PatientAppShell>
  );
}
