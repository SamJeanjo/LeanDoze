import { Activity, Droplet, LineChart, Utensils } from "lucide-react";
import { MetricCard } from "@/components/cards";
import { PatientLayout } from "@/components/layout";
import { getPatientAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export default async function PatientProgressPage() {
  const { patientProfile } = await getPatientAppState();
  const proteinAverage = average(patientProfile?.nutritionLogs.map((log) => log.proteinGrams ?? 0) ?? []);
  const hydrationAverage = average(patientProfile?.hydrationLogs.map((log) => log.ounces) ?? []);
  const energyAverage = average(patientProfile?.dailyCheckIns.map((log) => log.energyLevel ?? 0) ?? []);
  const weightLogs = patientProfile?.weightLogs ?? [];

  return (
    <PatientLayout
      eyebrow="Progress"
      title="Your weekly pattern."
      description="Simple trends for protein, hydration, energy, and weight. Keep logging so your clinician can review patterns with you."
      activePath="/app/progress"
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Protein" value={`${proteinAverage}g`} helper="recent average" progress={Math.min(100, proteinAverage)} icon={Utensils} tone="green" />
        <MetricCard label="Hydration" value={`${hydrationAverage}oz`} helper="recent average" progress={Math.min(100, hydrationAverage)} icon={Droplet} />
        <MetricCard label="Energy" value={energyAverage ? `${energyAverage}/10` : "-"} helper="recent check-ins" progress={energyAverage * 10} icon={Activity} />
        <MetricCard label="Weight logs" value={`${weightLogs.length}`} helper="latest entries" progress={Math.min(100, weightLogs.length * 12)} icon={LineChart} tone="navy" />
      </div>

      <section className="mt-6 rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Weight progress</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748B]">Tracking view only. LeanDoze does not provide medical advice.</p>
        <div className="mt-8 flex h-72 items-end gap-2 rounded-2xl bg-[#F8FAFC] p-5 ring-1 ring-[#E2E8F0]">
          {(weightLogs.length ? weightLogs : Array.from({ length: 8 })).map((log, index) => {
            const height = "weightLb" in Object(log ?? {}) ? Math.max(18, Math.min(95, Number((log as { weightLb: number }).weightLb) / 2.4)) : 36 + index * 4;
            return <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#17C2B2] to-[#7EE6D6]" style={{ height: `${height}%` }} />;
          })}
        </div>
      </section>
    </PatientLayout>
  );
}
