"use client";

import { FileText, MessageSquarePlus } from "lucide-react";
import type { ClinicReportPatient, PatientLog } from "@/lib/mockClinicReports";
import { riskTone, weightChange } from "@/lib/reportUtils";

type FollowUpQueueProps = {
  patients: ClinicReportPatient[];
  logs: PatientLog[];
  onPatientSelect: (patient: ClinicReportPatient) => void;
};

export function FollowUpQueue({ patients, logs, onPatientSelect }: FollowUpQueueProps) {
  const sorted = [...patients].sort((a, b) => {
    const rank = { "Needs follow-up": 0, Watch: 1, Stable: 2 };
    return rank[a.riskStatus] - rank[b.riskStatus];
  });

  return (
    <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.065)]">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Follow-Up Queue</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Patients with patterns that may need clinical review.</h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-[#64748B]">
          Needs follow-up is based on reported symptoms, hydration/protein patterns, missed doses, logging behavior, and weight change signals.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[22px] border border-[#E2E8F0]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] text-xs uppercase tracking-[0.16em] text-[#64748B]">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Medication</th>
              <th className="px-4 py-3">Dose stage</th>
              <th className="px-4 py-3">Last log</th>
              <th className="px-4 py-3">Reported symptoms</th>
              <th className="px-4 py-3">Weight trend</th>
              <th className="px-4 py-3">Hydration</th>
              <th className="px-4 py-3">Protein</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {sorted.map((patient) => {
              const patientLogs = logs.filter((log) => log.patientId === patient.id).slice(-7);
              const latest = patientLogs[patientLogs.length - 1];
              const symptoms = patientLogs.flatMap((log) => log.symptoms.map((symptom) => symptom.name));
              const hydration = patientLogs.length ? Math.round(patientLogs.reduce((sum, log) => sum + (log.hydrationOz / log.hydrationGoal) * 100, 0) / patientLogs.length) : 0;
              const protein = patientLogs.length ? Math.round(patientLogs.reduce((sum, log) => sum + (log.proteinGrams / log.proteinGoal) * 100, 0) / patientLogs.length) : 0;

              return (
                <tr key={patient.id} className="bg-white transition hover:bg-[#F8FAFC]">
                  <td className="px-4 py-4">
                    <button onClick={() => onPatientSelect(patient)} className="font-semibold text-[#0B1220] hover:text-[#0F766E]">{patient.name}</button>
                  </td>
                  <td className="px-4 py-4 text-[#64748B]">{patient.brand}</td>
                  <td className="px-4 py-4 text-[#64748B]">{patient.dose}</td>
                  <td className="px-4 py-4 text-[#64748B]">{latest ? new Date(latest.date).toLocaleDateString() : patient.lastLogDate}</td>
                  <td className="max-w-[220px] px-4 py-4 text-[#64748B]">{[...new Set(symptoms)].slice(0, 3).join(", ") || "None logged"}</td>
                  <td className="px-4 py-4 text-[#64748B]">{weightChange(patient)} lb</td>
                  <td className="px-4 py-4 text-[#64748B]">{hydration}%</td>
                  <td className="px-4 py-4 text-[#64748B]">{protein}%</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskTone(patient.riskStatus) === "coral" ? "bg-rose-50 text-[#BE123C]" : riskTone(patient.riskStatus) === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {patient.riskStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => onPatientSelect(patient)} className="inline-flex h-9 items-center rounded-full bg-[#07111F] px-3 text-xs font-semibold text-white">View patient</button>
                      <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[#64748B]" aria-label="Generate report">
                        <FileText className="h-4 w-4" />
                      </button>
                      <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[#64748B]" aria-label="Add note">
                        <MessageSquarePlus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!sorted.length ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
          <p className="font-semibold text-[#0B1220]">No patients match these filters.</p>
          <p className="mt-2 text-sm text-[#64748B]">Clear filters or broaden the date range to see more report data.</p>
        </div>
      ) : null}
    </section>
  );
}
