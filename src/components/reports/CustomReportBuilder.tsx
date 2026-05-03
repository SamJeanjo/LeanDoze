"use client";

import { CheckCircle2, FileSpreadsheet, FileText } from "lucide-react";

const metrics = ["Weight", "Symptoms", "Dose adherence", "Protein", "Hydration", "Muscle Protection Score", "Notes"];

export function CustomReportBuilder() {
  return (
    <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.065)]">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Custom Report Builder</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Build clinic reports by filtering patient segments and metrics.</h2>
        </div>
        <span className="rounded-full bg-[#ECFEFF] px-3 py-1 text-xs font-bold text-[#0F766E] ring-1 ring-[#99F6E4]">Builder preview</span>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr_0.7fr]">
        <div className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <h3 className="font-semibold text-[#07111F]">Report scope</h3>
          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">Date range</span>
            <select className="mt-2 h-11 w-full rounded-2xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom</option>
            </select>
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">Patient segment</span>
            <select className="mt-2 h-11 w-full rounded-2xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold">
              <option>All active patients</option>
              <option>Needs follow-up</option>
              <option>Semaglutide patients</option>
              <option>Tirzepatide patients</option>
            </select>
          </label>
        </div>

        <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-4">
          <h3 className="font-semibold text-[#07111F]">Metrics</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <label key={metric} className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0B1220]">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#14B8A6]" />
                {metric}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[#E2E8F0] bg-[#07111F] p-4 text-white">
          <h3 className="font-semibold">Output</h3>
          <div className="mt-4 grid gap-3">
            {[
              ["PDF", FileText],
              ["CSV", FileSpreadsheet],
              ["Clinic summary", CheckCircle2],
            ].map(([label, Icon]) => (
              <label key={label as string} className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold">
                <input type="radio" name="output" defaultChecked={label === "PDF"} className="h-4 w-4 accent-[#14B8A6]" />
                <Icon className="h-4 w-4 text-[#7DD3C7]" />
                {label as string}
              </label>
            ))}
          </div>
          <button className="mt-5 h-11 w-full rounded-full bg-white text-sm font-semibold text-[#07111F] transition hover:-translate-y-0.5">Generate report</button>
        </div>
      </div>
    </section>
  );
}
