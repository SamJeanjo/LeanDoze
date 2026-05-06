import { AlertTriangle, CalendarX2, HeartPulse, RadioTower, UsersRound } from "lucide-react";
import { ClinicLayout } from "@/components/layout";
import { ClinicReportsAnalytics } from "@/components/reports/ClinicReportsAnalytics";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function ClinicReportsPage() {
  const { patients } = await getClinicAppState();
  const symptomSpikePatients = patients.filter((patient) =>
    patient.symptomLogs.some((log) =>
      ["MODERATE", "SEVERE"].includes(log.nausea) ||
      ["MODERATE", "SEVERE"].includes(log.vomiting) ||
      ["MODERATE", "SEVERE"].includes(log.constipation) ||
      ["MODERATE", "SEVERE"].includes(log.abdominalPain),
    ),
  ).length;
  const missedDosePatients = patients.filter((patient) => patient.doseLogs.some((dose) => dose.missed)).length;
  const lowLoggingPatients = patients.filter((patient) => !patient.dailyCheckIns.length).length;
  const openRiskFlags = patients.reduce((sum, patient) => sum + patient.riskFlags.length, 0);

  return (
    <ClinicLayout
      eyebrow="Analytics"
      title="Clinic reporting command center."
      description="Real patient-panel signals first, then deeper report exploration for progress, side effects, adherence, medication groups, and follow-up."
      activePath="/clinic/reports"
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Connected patients", value: patients.length, helper: "live PatientAccess grants", icon: UsersRound },
            { label: "Open risk flags", value: openRiskFlags, helper: "review queue", icon: AlertTriangle },
            { label: "Missed-dose trends", value: missedDosePatients, helper: "patients with missed dose logs", icon: CalendarX2 },
            { label: "Symptom spikes", value: symptomSpikePatients, helper: "moderate or severe recent symptoms", icon: HeartPulse },
            { label: "Low logging", value: lowLoggingPatients, helper: "no recent check-in captured", icon: RadioTower },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <Icon className="size-5 text-[#0F766E]" />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#07111F]">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{metric.helper}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-[28px] border border-teal-100 bg-[#ECFEFF] p-5 text-sm leading-6 text-slate-700">
          Live metrics above are calculated from connected patient data. The exploration workspace below preserves the premium analytics demo until the full report builder is wired to those same live cohorts.
        </section>

        <ClinicReportsAnalytics />
      </div>
    </ClinicLayout>
  );
}
