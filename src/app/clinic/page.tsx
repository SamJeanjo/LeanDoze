import { MetricCard, PatientCard } from "@/components/cards";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { clinicStats, patients } from "@/lib/mock-data";
import { demoSafetyFlags } from "@/lib/safety";

export default function ClinicDashboard() {
  return (
    <div>
      <DashboardShell
        eyebrow="Clinic Dashboard"
        title="Monitor GLP-1 progress between visits."
        description="A high-signal view of patient progress, side effect alerts, missed doses, and adherence patterns."
        action={<StatusBadge tone="coral">3 high priority alerts</StatusBadge>}
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {clinicStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </div>

        <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Patient list</h2>
              <p className="mt-1 text-sm text-slate-500">Weight trend summaries, alerts, and adherence score.</p>
            </div>
            <input
              className="h-11 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
              placeholder="Search patients"
            />
          </div>
          <div className="mt-5 grid gap-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Risk flags</h2>
              <p className="mt-1 text-sm text-slate-500">
                Pattern detection for clinician review. LeanDoze does not diagnose or prescribe.
              </p>
            </div>
            <StatusBadge tone="mint">Review this with your clinician.</StatusBadge>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {demoSafetyFlags.slice(0, 3).map((flag) => (
              <div key={flag.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">{flag.title}</p>
                  <StatusBadge tone={flag.severity === "WATCH" ? "mint" : "amber"}>{flag.severity}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{flag.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </DashboardShell>
      <Footer />
    </div>
  );
}
