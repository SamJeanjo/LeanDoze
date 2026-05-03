"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClinicReportPatient, PatientLog } from "@/lib/mockClinicReports";
import { symptomStats } from "@/lib/reportUtils";

type SymptomIntelligenceProps = {
  patients: ClinicReportPatient[];
  logs: PatientLog[];
};

const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5+"];

export function SymptomIntelligence({ patients, logs }: SymptomIntelligenceProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const stats = useMemo(() => symptomStats(logs), [logs]);
  const selected = selectedSymptom ?? stats[0]?.name ?? null;
  const selectedLogs = logs.filter((log) => log.symptoms.some((symptom) => symptom.name === selected));
  const affectedPatientIds = new Set(selectedLogs.map((log) => log.patientId));
  const affectedPatients = patients.filter((patient) => affectedPatientIds.has(patient.id));
  const medCounts = affectedPatients.reduce<Record<string, number>>((counts, patient) => {
    counts[`${patient.brand} ${patient.dose}`] = (counts[`${patient.brand} ${patient.dose}`] ?? 0) + 1;
    return counts;
  }, {});
  const commonMed = Object.entries(medCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Not enough data";
  const severityBreakdown = stats.find((item) => item.name === selected);

  const heatmap = days.map((day, index) => {
    const dayNumber = index + 1;
    const count = logs.filter((log) =>
      log.symptoms.some((symptom) => symptom.name === selected && (dayNumber === 5 ? symptom.dayAfterDose >= 5 : symptom.dayAfterDose === dayNumber)),
    ).length;
    return { day, count };
  });

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
      <div className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.065)]">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Symptom Intelligence</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Track symptom patterns by medication, dose, timing, and patient segment.</h2>
          </div>
          <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">Tracking insights only</span>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <h3 className="text-sm font-semibold text-[#07111F]">Symptom frequency</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "rgba(20,184,166,0.08)" }} />
                  <Bar dataKey="total" radius={[10, 10, 0, 0]} onClick={(data) => setSelectedSymptom(typeof data.name === "string" ? data.name : null)}>
                    {stats.map((item) => (
                      <Cell key={item.name} fill={item.name === selected ? "#14B8A6" : "#7DD3C7"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4">
            <h3 className="text-sm font-semibold text-[#07111F]">Severity distribution</h3>
            <div className="mt-4 space-y-3">
              {[
                ["Mild", severityBreakdown?.mild ?? 0, "bg-[#7DD3C7]"],
                ["Moderate", severityBreakdown?.moderate ?? 0, "bg-amber-400"],
                ["Severe", severityBreakdown?.severe ?? 0, "bg-[#FB7185]"],
              ].map(([label, value, color]) => (
                <div key={label as string}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#0B1220]">{label}</span>
                    <span className="text-[#64748B]">{value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#E2E8F0]/70">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Number(value) * 18)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-sm font-semibold text-[#07111F]">Day after dose intensity</h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {heatmap.map((item) => (
                <div key={item.day} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
                  <p className="text-[11px] font-bold text-[#64748B]">{item.day}</p>
                  <div
                    className="mx-auto mt-3 h-10 w-full rounded-xl"
                    style={{ backgroundColor: `rgba(20,184,166,${Math.min(0.75, 0.12 + item.count * 0.12)})` }}
                  />
                  <p className="mt-2 text-xs font-semibold text-[#0B1220]">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[22px] border border-[#E2E8F0]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-xs uppercase tracking-[0.16em] text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Medication</th>
                <th className="px-4 py-3">Dose level</th>
                <th className="px-4 py-3">Common symptom</th>
                <th className="px-4 py-3">Intensity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {patients.slice(0, 5).map((patient) => {
                const patientSymptoms = logs.filter((log) => log.patientId === patient.id).flatMap((log) => log.symptoms);
                return (
                  <tr key={patient.id} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-[#0B1220]">{patient.medication}</td>
                    <td className="px-4 py-3 text-[#64748B]">{patient.dose}</td>
                    <td className="px-4 py-3 text-[#64748B]">{patientSymptoms[0]?.name ?? "None logged"}</td>
                    <td className="px-4 py-3 text-[#64748B]">{patientSymptoms[0]?.severity ?? "Low"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="rounded-[28px] border border-[#E2E8F0]/80 bg-[#07111F] p-6 text-white shadow-[0_24px_70px_rgba(7,17,31,0.2)]">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#7DD3C7]">Drill-down</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">{selected ?? "No symptom selected"}</h3>
        <div className="mt-6 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Affected patients</p>
            <p className="mt-2 text-3xl font-semibold">{affectedPatients.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Most common medication / dose</p>
            <p className="mt-2 font-semibold">{commonMed}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Patients needing follow-up</p>
            <div className="mt-3 space-y-2">
              {affectedPatients.filter((patient) => patient.riskStatus !== "Stable").map((patient) => (
                <p key={patient.id} className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold">{patient.name}</p>
              ))}
              {!affectedPatients.filter((patient) => patient.riskStatus !== "Stable").length ? <p className="text-sm text-slate-400">None in this filtered set.</p> : null}
            </div>
          </div>
          <textarea placeholder="Notes placeholder..." className="min-h-28 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#14B8A6]" />
          <button className="h-11 rounded-full bg-white text-sm font-semibold text-[#07111F] transition hover:-translate-y-0.5">View patients</button>
        </div>
      </aside>
    </section>
  );
}
