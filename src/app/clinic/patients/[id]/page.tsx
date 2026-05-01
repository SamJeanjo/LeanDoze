import { notFound } from "next/navigation";
import { Download, MessageSquareText } from "lucide-react";
import { MetricCard } from "@/components/cards";
import { DashboardShell, Footer } from "@/components/layout";
import { ProgressBar } from "@/components/progress";
import { StatusBadge } from "@/components/status-badge";
import { patientMetrics, patients, timeline } from "@/lib/mock-data";

export default function PatientDetail({ params }: { params: { id: string } }) {
  const patient = patients.find((item) => item.id === params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div>
      <DashboardShell
        eyebrow="Patient Detail"
        title={patient.name}
        description={`${patient.medication}. Last dose ${patient.lastDose}. Current symptom summary: ${patient.symptoms}.`}
        action={
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Download className="size-4" />
            Export PDF report
          </button>
        }
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Weight chart</h2>
                <p className="mt-1 text-sm text-slate-500">12-week placeholder trend</p>
              </div>
              <StatusBadge tone="green">{patient.weightChange}</StatusBadge>
            </div>
            <div className="mt-8 flex h-72 items-end gap-2 rounded-2xl bg-slate-50 p-5">
              {[88, 84, 82, 77, 73, 71, 68, 64, 62, 59, 57, 55].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#22C55E] to-[#7DD3C7]" style={{ height: `${height}%` }} />
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Dose adherence</h2>
            <p className="mt-2 text-sm text-slate-500">Completion over the last 8 scheduled doses.</p>
            <div className="mt-6">
              <ProgressBar value={patient.adherence} tone={patient.adherence < 70 ? "coral" : "green"} />
            </div>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{patient.adherence}%</p>
            <div className="mt-8 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={`h-12 rounded-2xl ${index < 6 ? "bg-green-100 ring-1 ring-green-200" : "bg-rose-100 ring-1 ring-rose-200"}`} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {patientMetrics.slice(0, 3).map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
          <MetricCard label="Adherence" value={`${patient.adherence}%`} helper="last 8 doses" progress={patient.adherence} icon={MessageSquareText} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Symptoms timeline</h2>
            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div key={`${item.date}-${item.event}`} className="flex gap-4">
                  <div className="w-16 text-sm font-semibold text-slate-500">{item.date}</div>
                  <div className="flex-1 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    {item.event}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Notes</h2>
            <textarea
              className="mt-5 min-h-52 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
              defaultValue="Patient reports appetite suppression remains manageable. Review constipation protocol and reinforce hydration goal before next dose escalation."
            />
          </section>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
