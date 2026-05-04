"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, Share2 } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { clinicianReportSummary } from "@/lib/patientInsights";
import { formatLocalLogsForReport, getPatientState, patientStateChangedEvent } from "@/lib/patientStorage";

export function ClinicianReportPreview({ profile, logs, full = false }: { profile: PatientProfileMock; logs: DailyLogMock[]; full?: boolean }) {
  const [state, setState] = useState(() => getPatientState());
  const localLogs = useMemo(() => formatLocalLogsForReport(state), [state]);
  const displayLogs = localLogs.length ? localLogs : full ? [] : logs;
  const summary = clinicianReportSummary(displayLogs, profile);

  useEffect(() => {
    const sync = () => setState(getPatientState());

    window.addEventListener(patientStateChangedEvent, sync);

    return () => window.removeEventListener(patientStateChangedEvent, sync);
  }, []);

  return (
    <PremiumCard className="p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Clinician report</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">Your next visit, already organized.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">A calm 14/30-day summary built from what you log.</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
          <FileText className="h-5 w-5" />
        </div>
      </div>

      {displayLogs.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Weight trend", summary.weightTrend],
            ["Symptom notes", summary.symptomNotes],
            ["Protein / hydration", `${summary.protein}; ${summary.hydration}`],
            ["Dose adherence", summary.dose],
          ].map(([label, value]) => (
            <div key={label} className="relative z-0 rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#07111F]">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-[#F8FAFC] p-6">
          <p className="text-base font-semibold text-[#07111F]">Your report will build as you check in.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Log weight, protein, water, and symptoms when you want. Small check-ins make your next visit easier to organize.</p>
        </div>
      )}

      {full && displayLogs.length ? (
        <div className="relative z-0 mt-6 rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold text-[#07111F]">Questions for clinician</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-[#64748B]">
            {summary.questions.map((question) => (
              <li key={question}>- {question}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/app/reports" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
          <FileText className="h-4 w-4" />
          Preview report
        </Link>
        <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 ease-out hover:bg-slate-200">
          <Share2 className="h-4 w-4" />
          Share with clinic
        </button>
      </div>
    </PremiumCard>
  );
}
