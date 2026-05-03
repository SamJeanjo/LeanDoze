"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ClinicReportPatient } from "@/lib/mockClinicReports";
import { segmentCounts } from "@/lib/reportUtils";

type DemographicsReportProps = {
  patients: ClinicReportPatient[];
};

export function DemographicsReport({ patients }: DemographicsReportProps) {
  const sex = segmentCounts(patients, "sex");
  const age = segmentCounts(patients, "age");
  const stage = segmentCounts(patients, "stage");

  return (
    <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.065)]">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Patient Segments</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Understand trends across sex, age range, and treatment stage.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Sex", "Age group", "Treatment duration", "Medication type"].map((item) => (
            <span key={item} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-bold text-[#475569]">{item}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <h3 className="text-sm font-semibold text-[#07111F]">Sex-based breakdown</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sex} dataKey="total" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={3}>
                  {sex.map((entry, index) => (
                    <Cell key={entry.name} fill={["#14B8A6", "#22C55E", "#7DD3C7"][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {sex.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm">
                <span className="font-semibold text-[#0B1220]">{item.name}</span>
                <span className="text-[#64748B]">{item.total}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#07111F]">Age range and treatment duration cohorts</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={age}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="stable" stackId="a" fill="#22C55E" radius={[0, 0, 8, 8]} />
                <Bar dataKey="watch" stackId="a" fill="#F59E0B" />
                <Bar dataKey="followUp" stackId="a" fill="#FB7185" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {stage.map((item) => (
              <div key={item.name} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{item.name}</p>
                <p className="mt-2 text-2xl font-semibold text-[#07111F]">{item.total}</p>
                <p className="mt-1 text-xs text-[#64748B]">{item.followUp} follow-up</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
