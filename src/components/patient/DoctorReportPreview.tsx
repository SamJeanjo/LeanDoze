import Link from "next/link";
import { FileText, Share2 } from "lucide-react";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { clinicianReportSummary } from "@/lib/patientInsights";

export function DoctorReportPreview({ profile, logs }: { profile: PatientProfileMock; logs: DailyLogMock[] }) {
  const summary = clinicianReportSummary(logs, profile);

  return (
    <section className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Clinician report</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Your next clinician report</h2>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">A calm summary of the last 14/30 days, built from what you log.</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
          <FileText className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Weight trend", summary.weightTrend],
          ["Symptom notes", summary.symptomNotes],
          ["Protein", summary.protein],
          ["Hydration", summary.hydration],
          ["Dose adherence", summary.dose],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-[#E2E8F0]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#07111F]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-[#FFF7ED] p-4 ring-1 ring-orange-100">
        <p className="text-sm font-semibold text-amber-900">Questions for clinician</p>
        <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-800">
          {summary.questions.map((question) => (
            <li key={question}>- {question}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/app/report" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          <FileText className="h-4 w-4" />
          Preview report
        </Link>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#0B1220] transition hover:bg-[#F8FAFC]">
          <Share2 className="h-4 w-4" />
          Share with clinic
        </button>
      </div>
    </section>
  );
}
