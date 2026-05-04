import { MuscleProtection } from "@/components/patient/MuscleProtection";
import { PatientShell } from "@/components/patient/PatientShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientBodyPage() {
  return (
    <PatientShell active="progress">
      <div className="ld-page-enter space-y-6">
        <PageHeader eyebrow="Body & strength" title="Protect the habits that support strength." description="Keep protein, movement, measurements, and optional photos organized without turning it into a diet app." />
        <MuscleProtection profile={patientProfileMock} logs={dailyLogsMock} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Protein consistency", "3 days near target", 72],
            ["Strength streak", "3 days this week", 43],
            ["Measurement rhythm", "Reminder ready", 36],
          ].map(([label, value, progress]) => (
            <PremiumCard key={label}>
              <p className="text-sm font-medium text-[#64748B]">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#07111F]">{value}</p>
              <ProgressBar value={Number(progress)} tone="teal" className="mt-5" />
            </PremiumCard>
          ))}
        </div>
      </div>
    </PatientShell>
  );
}
