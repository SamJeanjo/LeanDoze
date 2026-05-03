"use client";

import { X } from "lucide-react";
import type { ClinicReportPatient, PatientLog } from "@/lib/mockClinicReports";
import { formatPercent, weightChange } from "@/lib/reportUtils";

type PatientDrilldownDrawerProps = {
  patient: ClinicReportPatient | null;
  logs: PatientLog[];
  onClose: () => void;
};

export function PatientDrilldownDrawer({ patient, logs, onClose }: PatientDrilldownDrawerProps) {
  if (!patient) {
    return null;
  }

  const patientLogs = logs.filter((log) => log.patientId === patient.id).slice(-7);
  const adherence = patientLogs.length ? (patientLogs.filter((log) => log.doseTaken).length / patientLogs.length) * 100 : 0;
  const proteinAverage = patientLogs.length ? Math.round(patientLogs.reduce((sum, log) => sum + log.proteinGrams, 0) / patientLogs.length) : 0;
  const hydrationAverage = patientLogs.length ? Math.round(patientLogs.reduce((sum, log) => sum + log.hydrationOz, 0) / patientLogs.length) : 0;
  const symptoms = patientLogs.flatMap((log) => log.symptoms);

  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-[#07111F]/35 backdrop-blur-sm" aria-label="Close patient drawer" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] overflow-y-auto bg-white p-6 shadow-[0_30px_90px_rgba(7,17,31,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Patient drill-down</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">{patient.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              {patient.brand} {patient.dose} · started {new Date(patient.startDate).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#0B1220]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["Current weight", `${patient.currentWeight} lb`],
            ["Weight change", `${weightChange(patient)} lb`],
            ["Dose adherence", formatPercent(adherence)],
            ["Muscle score", `${patient.muscleProtectionScore} / 100`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
              <p className="mt-2 text-xl font-semibold text-[#07111F]">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-[#07111F]">Symptom timeline</h3>
          <div className="mt-4 space-y-3">
            {patientLogs.map((log) => (
              <div key={log.id} className="rounded-2xl bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#0B1220]">{new Date(log.date).toLocaleDateString()}</p>
                  <p className="text-xs font-semibold text-[#64748B]">Day {log.doseDayNumber} after dose</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {log.symptoms.length ? log.symptoms.map((symptom) => `${symptom.name} (${symptom.severity})`).join(", ") : "No symptoms logged"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <h3 className="font-semibold text-[#07111F]">Protein and hydration</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            7-day average: {proteinAverage}g protein and {hydrationAverage}oz hydration. Review patterns with clinician before acting on them.
          </p>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-semibold text-[#07111F]">Notes</h3>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">{patient.notes}</p>
          <p className="mt-4 text-sm font-semibold text-[#0F766E]">Next appointment: {patient.nextAppointment}</p>
        </section>

        <button className="mt-6 h-12 w-full rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.22)] transition hover:-translate-y-0.5">
          Export patient report
        </button>

        {symptoms.length ? (
          <p className="mt-4 text-xs leading-5 text-[#64748B]">
            These reports summarize patient-entered tracking data and support clinical review only.
          </p>
        ) : null}
      </aside>
    </div>
  );
}
