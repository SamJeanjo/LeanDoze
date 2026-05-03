import { Download, FileText, MessageSquareText, Share2 } from "lucide-react";
import { DoctorReportPreview } from "@/components/patient/DoctorReportPreview";
import { PatientAppShell } from "@/components/patient/PatientAppShell";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";
import { clinicianReportSummary } from "@/lib/patientInsights";

export const dynamic = "force-dynamic";

export default function PatientReportPage() {
  const summary = clinicianReportSummary(dailyLogsMock, patientProfileMock);

  return (
    <PatientAppShell active="report">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[34px] border border-[#E2E8F0]/80 bg-[#07111F] p-6 text-white shadow-[0_30px_90px_rgba(7,17,31,0.24)] sm:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#14B8A6]/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7DD3C7]">Doctor report preview</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em]">Your data, ready for your clinician.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">
              Review your last 14/30 days before sharing. You control what clinics can access.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#07111F] transition hover:-translate-y-0.5">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                <Share2 className="h-4 w-4" />
                Share with clinic
              </button>
            </div>
          </div>
        </section>

        <DoctorReportPreview profile={patientProfileMock} logs={dailyLogsMock} />

        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Weight trend", summary.weightTrend],
            ["Symptom notes", summary.symptomNotes],
            ["Protein/hydration", `${summary.protein}; ${summary.hydration}`],
            ["Dose adherence", summary.dose],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[26px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.055)]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
                  <FileText className="h-4 w-4" />
                </div>
                <p className="font-semibold text-[#07111F]">{label}</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#64748B]">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF7ED] text-amber-700 ring-1 ring-orange-100">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-[#07111F]">Questions for clinician</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {summary.questions.map((question) => (
              <div key={question} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm font-semibold text-[#0B1220] ring-1 ring-[#E2E8F0]">
                {question}
              </div>
            ))}
          </div>
        </section>

        <p className="rounded-2xl bg-white p-4 text-xs leading-5 text-[#64748B] ring-1 ring-[#E2E8F0]">
          LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.
        </p>
      </div>
    </PatientAppShell>
  );
}
