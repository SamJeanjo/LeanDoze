import { Download, FileText } from "lucide-react";
import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { generateDoctorReportAction } from "@/lib/app-actions";
import { getPatientAppState, reportDisclaimer } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function DoctorReportsPage() {
  const { patientProfile } = await getPatientAppState();
  const reports = patientProfile?.doctorReports ?? [];
  const activeReport = reports[0];
  const data = activeReport?.reportData as
    | {
        weightTrend?: string;
        adherence?: number;
        hydrationAverage?: number;
        proteinAverage?: number;
        symptomLogs?: number;
        medication?: string;
        doseMg?: number | null;
        patientNotes?: string[];
        discussionTopics?: string[];
        riskFlags?: Array<{ title: string; level: string; description: string }>;
      }
    | undefined;

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <PatientLayout
        eyebrow="DOCTOR REPORT"
        title="Clinic-ready progress summary."
        description="Generate a clear report for your clinician with adherence, trends, symptoms, and safety flags."
        action={
          <form action={generateDoctorReportAction} className="flex gap-2">
            <select name="days" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
              <option value="7">7 days</option>
              <option value="30">30 days</option>
            </select>
            <button className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
              <Download className="h-4 w-4" />
              Generate report
            </button>
          </form>
        }
        activePath="/app/reports"
      >
        <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">
                {activeReport ? `${activeReport.startDate.toLocaleDateString()} - ${activeReport.endDate.toLocaleDateString()}` : "No report yet"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#050816]">
                {activeReport ? "Latest doctor report" : "Generate your first report"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                {activeReport?.summary ?? "Reports will include weight trend, adherence, hydration average, protein average, symptom summary, and risk flags."}
              </p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Dose adherence", data?.adherence !== undefined ? `${data.adherence}%` : "Pending", "Based on logged doses"],
              ["Medication", data?.medication ?? "Pending", data?.doseMg ? `${data.doseMg}mg active plan` : "From medication setup"],
              ["Protein average", data?.proteinAverage !== undefined ? `${data.proteinAverage}g/day` : "Pending", "From nutrition logs"],
              ["Hydration average", data?.hydrationAverage !== undefined ? `${data.hydrationAverage}oz/day` : "Pending", "From hydration logs"],
              ["Weight trend", data?.weightTrend ?? "Pending", "From weight logs"],
            ].map(([label, value, helper]) => (
              <div key={label} className="rounded-[22px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
                <p className="text-sm font-medium text-[#64748B]">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#050816]">{value}</p>
                <p className="mt-1 text-sm text-[#64748B]">{helper}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[#FFF7ED] p-4 text-sm leading-6 text-slate-700 ring-1 ring-orange-100">
            {reportDisclaimer}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5">
              <h3 className="text-lg font-semibold text-[#050816]">Suggested discussion topics</h3>
              <div className="mt-4 space-y-3">
                {(data?.discussionTopics?.length ? data.discussionTopics : ["Bring this report to your next clinician visit."]).map((topic) => (
                  <p key={topic} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
                    {topic}
                  </p>
                ))}
              </div>
            </section>
            <section className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5">
              <h3 className="text-lg font-semibold text-[#050816]">Patient notes</h3>
              <div className="mt-4 space-y-3">
                {(data?.patientNotes?.length ? data.patientNotes : ["No notes added in this report period."]).map((note) => (
                  <p key={note} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B]">
                    {note}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#050816]">Risk flags</h3>
            <div className="mt-4 space-y-3">
              {(data?.riskFlags ?? patientProfile?.riskFlags ?? []).map((flag) => (
                <div key={flag.title} className="rounded-[18px] border border-[#E2E8F0]/80 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#0B1220]">{flag.title}</p>
                    <StatusBadge tone={flag.level === "URGENT" ? "coral" : "amber"}>{flag.level}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{flag.description}</p>
                  <p className="mt-3 text-sm font-semibold text-[#0F766E]">Review this with your clinician.</p>
                </div>
              ))}
              {!data?.riskFlags?.length && !patientProfile?.riskFlags.length ? <p className="text-sm text-slate-500">No active flags in the current report.</p> : null}
            </div>
          </div>
        </section>
      </PatientLayout>
    </div>
  );
}
