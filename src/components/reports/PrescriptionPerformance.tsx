"use client";

import type { ClinicReportPatient, PatientLog } from "@/lib/mockClinicReports";
import { formatPercent, medicationRows } from "@/lib/reportUtils";

type PrescriptionPerformanceProps = {
  patients: ClinicReportPatient[];
  logs: PatientLog[];
  onMedicationSelect: (medication: string) => void;
};

export function PrescriptionPerformance({ patients, logs, onMedicationSelect }: PrescriptionPerformanceProps) {
  const rows = medicationRows(patients, logs);

  return (
    <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.065)]">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Prescription Performance</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Compare progress and reported tolerance across medication groups.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Semaglutide", "Tirzepatide", "Liraglutide", "Other"].map((medication) => (
            <button key={medication} onClick={() => onMedicationSelect(medication)} className="h-9 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-xs font-bold text-[#475569] transition hover:bg-white hover:text-[#0B1220]">
              {medication}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <button key={row.medication} onClick={() => onMedicationSelect(row.medication)} className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
            <p className="text-sm font-semibold text-[#64748B]">{row.medication}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">{row.patients}</p>
            <p className="mt-1 text-sm text-[#64748B]">patients · {row.commonSymptoms}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-[#E2E8F0]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] text-xs uppercase tracking-[0.16em] text-[#64748B]">
            <tr>
              <th className="px-4 py-3">Medication</th>
              <th className="px-4 py-3">Patients</th>
              <th className="px-4 py-3">Avg weight change</th>
              <th className="px-4 py-3">Common symptoms</th>
              <th className="px-4 py-3">Missed dose rate</th>
              <th className="px-4 py-3">Avg adherence</th>
              <th className="px-4 py-3">Follow-up flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {rows.map((row) => (
              <tr key={row.medication} onClick={() => onMedicationSelect(row.medication)} className="cursor-pointer bg-white transition hover:bg-[#F8FAFC]">
                <td className="px-4 py-4 font-semibold text-[#0B1220]">{row.medication}</td>
                <td className="px-4 py-4 text-[#64748B]">{row.patients}</td>
                <td className="px-4 py-4 text-[#64748B]">{row.avgWeightChange.toFixed(1)} lb</td>
                <td className="px-4 py-4 text-[#64748B]">{row.commonSymptoms}</td>
                <td className="px-4 py-4 text-[#64748B]">{formatPercent(row.missedDoseRate)}</td>
                <td className="px-4 py-4 text-[#64748B]">{formatPercent(row.avgAdherence)}</td>
                <td className="px-4 py-4">
                  <span className={row.followUpFlags ? "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-[#BE123C]" : "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"}>
                    {row.followUpFlags}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
