import { notFound } from "next/navigation";
import { RiskFlagStatus } from "@prisma/client";
import { Download, MessageSquareText } from "lucide-react";
import { MetricCard } from "@/components/cards";
import { ClinicLayout } from "@/components/layout";
import { ProgressBar } from "@/components/progress";
import { StatusBadge } from "@/components/status-badge";
import { getClinicPatient } from "@/lib/app-data";

export const dynamic = "force-dynamic";

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export default async function PatientDetail({ params }: { params: { id: string } }) {
  const patient = await getClinicPatient(params.id);

  if (!patient) {
    notFound();
  }

  const plan = patient.medicationPlans[0];
  const proteinAvg = average(patient.nutritionLogs.map((log) => log.proteinGrams ?? 0));
  const hydrationAvg = average(patient.hydrationLogs.map((log) => log.ounces));
  const adherence = patient.doseLogs.length
    ? Math.round((patient.doseLogs.filter((dose) => dose.taken).length / patient.doseLogs.length) * 100)
    : 100;
  const openFlags = patient.riskFlags.filter((flag) => flag.status === RiskFlagStatus.OPEN);
  const resolvedFlags = patient.riskFlags.filter((flag) => flag.status === RiskFlagStatus.RESOLVED);
  const groupedOpenFlags = {
    URGENT: openFlags.filter((flag) => flag.level === "URGENT"),
    HIGH: openFlags.filter((flag) => flag.level === "HIGH"),
    MEDIUM: openFlags.filter((flag) => flag.level === "MEDIUM"),
    LOW: openFlags.filter((flag) => flag.level === "LOW" || flag.level === "INFO"),
  };

  return (
    <div>
      <ClinicLayout
        eyebrow="Patient Detail"
        title={patientName(patient)}
        description={`${plan ? `${plan.medication} ${plan.doseMg}mg` : "No active medication plan"}. Clinics see this only because active PatientAccess exists.`}
        action={
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Download className="size-4" />
            Export PDF report
          </button>
        }
        activePath="/clinic/patients"
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Weight chart</h2>
                <p className="mt-1 text-sm text-slate-500">Logged patient weights</p>
              </div>
              <StatusBadge tone="green">{patient.weightLogs.length} logs</StatusBadge>
            </div>
            <div className="mt-8 flex h-72 items-end gap-2 rounded-2xl bg-slate-50 p-5">
              {(patient.weightLogs.length ? patient.weightLogs : Array.from({ length: 8 })).map((log, index) => {
                const height = "weightLb" in Object(log ?? {}) ? Math.max(18, Math.min(95, Number((log as { weightLb: number }).weightLb) / 2.4)) : 45 + index * 4;
                return <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#22C55E] to-[#7DD3C7]" style={{ height: `${height}%` }} />;
              })}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Dose adherence</h2>
            <p className="mt-2 text-sm text-slate-500">Completion over logged scheduled doses.</p>
            <div className="mt-6">
              <ProgressBar value={adherence} tone={adherence < 70 ? "coral" : "green"} />
            </div>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{adherence}%</p>
            <div className="mt-8 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={`h-12 rounded-2xl ${index < Math.round(adherence / 12.5) ? "bg-green-100 ring-1 ring-green-200" : "bg-rose-100 ring-1 ring-rose-200"}`} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Protein" value={`${proteinAvg}g`} helper="7-log average" progress={Math.min(100, proteinAvg)} icon={MessageSquareText} />
          <MetricCard label="Hydration" value={`${hydrationAvg}oz`} helper="7-log average" progress={Math.min(100, hydrationAvg)} icon={MessageSquareText} />
          <MetricCard label="Flags" value={`${openFlags.length}`} helper="open review items" progress={Math.min(100, openFlags.length * 20)} icon={MessageSquareText} tone={openFlags.length ? "coral" : "green"} />
          <MetricCard label="Reports" value={`${patient.doctorReports.length}`} helper="generated summaries" progress={Math.min(100, patient.doctorReports.length * 25)} icon={MessageSquareText} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Symptoms timeline</h2>
            <div className="mt-6 space-y-4">
              {patient.symptomLogs.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 text-sm font-semibold text-slate-500">{item.loggedAt.toLocaleDateString()}</div>
                  <div className="flex-1 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    Nausea {item.nausea.toLowerCase()}, constipation {item.constipation.toLowerCase()}, reflux {item.reflux.toLowerCase()}, fatigue {item.fatigue.toLowerCase()}.
                  </div>
                </div>
              ))}
              {!patient.symptomLogs.length ? <p className="text-sm text-slate-500">No symptoms logged yet.</p> : null}
            </div>
          </section>
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Risk flags</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Last evaluated {patient.riskEvaluatedAt ? patient.riskEvaluatedAt.toLocaleString() : "after the next completed check-in"}.
                </p>
              </div>
              <StatusBadge tone={openFlags.length ? "amber" : "green"}>{openFlags.length ? "Needs review" : "On track"}</StatusBadge>
            </div>
            <div className="mt-5 space-y-4">
              {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((level) => (
                <div key={level} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{level}</p>
                    <StatusBadge tone={level === "URGENT" || level === "HIGH" ? "coral" : level === "MEDIUM" ? "amber" : "navy"}>
                      {groupedOpenFlags[level].length}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 space-y-3">
                    {groupedOpenFlags[level].map((flag) => (
                      <div key={flag.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                        <p className="font-semibold text-slate-950">{flag.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{flag.description}</p>
                        <p className="mt-3 text-sm font-semibold text-[#0F766E]">{flag.recommendation ?? "Review this with your clinician."}</p>
                      </div>
                    ))}
                    {!groupedOpenFlags[level].length ? <p className="text-sm text-slate-500">No open {level.toLowerCase()} flags.</p> : null}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-950">Resolved history</h3>
                <div className="mt-3 space-y-2">
                  {resolvedFlags.slice(0, 5).map((flag) => (
                    <div key={flag.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{flag.title}</p>
                        <p className="mt-1 text-slate-500">{flag.source}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-slate-400">{flag.resolvedAt?.toLocaleDateString()}</span>
                    </div>
                  ))}
                  {!resolvedFlags.length ? <p className="text-sm text-slate-500">No resolved flag history yet.</p> : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </ClinicLayout>
    </div>
  );
}
