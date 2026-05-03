"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { type ReportFilter, defaultReportFilter, symptomOptions } from "@/lib/mockClinicReports";

type ReportFilterBarProps = {
  filters: ReportFilter;
  onChange: (filters: ReportFilter) => void;
  resultCount: number;
};

const medications = ["All", "Semaglutide", "Tirzepatide", "Liraglutide", "Other"];
const brands = ["All", "Ozempic", "Wegovy", "Mounjaro", "Zepbound", "Saxenda", "Other"];
const doses = ["All", "0.25 mg", "0.5 mg", "1 mg", "1.8 mg", "5 mg", "7.5 mg", "Custom"];
const sexes = ["All", "Female", "Male", "Other / not specified"];
const ageRanges = ["All", "18-34", "35-49", "50-64", "65+"];
const riskStatuses = ["All", "Stable", "Watch", "Needs follow-up"];
const adherenceStatuses = ["All", "On track", "Missed dose", "Low logging"];

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="min-w-[150px] flex-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748B]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-2xl border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#0B1220] outline-none transition focus:border-[#14B8A6] focus:ring-4 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ReportFilterBar({ filters, onChange, resultCount }: ReportFilterBarProps) {
  const setFilter = <K extends keyof ReportFilter>(key: K, value: ReportFilter[K]) => onChange({ ...filters, [key]: value });
  const activeChips = [
    filters.medication !== "All" ? ["medication", filters.medication] : null,
    filters.brand !== "All" ? ["brand", filters.brand] : null,
    filters.dose !== "All" ? ["dose", filters.dose] : null,
    filters.sex !== "All" ? ["sex", filters.sex] : null,
    filters.ageRange !== "All" ? ["ageRange", filters.ageRange] : null,
    filters.riskStatus !== "All" ? ["riskStatus", filters.riskStatus] : null,
    filters.adherenceStatus !== "All" ? ["adherenceStatus", filters.adherenceStatus] : null,
    ...filters.symptoms.map((symptom) => ["symptoms", symptom]),
  ].filter(Boolean) as Array<[keyof ReportFilter, string]>;

  return (
    <section className="sticky top-16 z-30 rounded-[28px] border border-[#E2E8F0]/80 bg-white/92 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="relative min-w-[260px] flex-[1.2]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 text-[#64748B]" />
            <input
              value={filters.search}
              onChange={(event) => setFilter("search", event.target.value)}
              placeholder="Search patient"
              className="h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-[#94A3B8] focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <SelectField label="Medication" value={filters.medication} options={medications} onChange={(value) => setFilter("medication", value)} />
            <SelectField label="Brand" value={filters.brand} options={brands} onChange={(value) => setFilter("brand", value)} />
            <SelectField label="Dose" value={filters.dose} options={doses} onChange={(value) => setFilter("dose", value)} />
            <SelectField label="Sex" value={filters.sex} options={sexes} onChange={(value) => setFilter("sex", value)} />
            <SelectField label="Age" value={filters.ageRange} options={ageRanges} onChange={(value) => setFilter("ageRange", value)} />
            <SelectField label="Risk" value={filters.riskStatus} options={riskStatuses} onChange={(value) => setFilter("riskStatus", value)} />
            <SelectField label="Adherence" value={filters.adherenceStatus} options={adherenceStatuses} onChange={(value) => setFilter("adherenceStatus", value)} />
          </div>
        </div>

        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((symptom) => {
              const active = filters.symptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  type="button"
                  onClick={() =>
                    setFilter(
                      "symptoms",
                      active ? filters.symptoms.filter((item) => item !== symptom) : [...filters.symptoms, symptom],
                    )
                  }
                  className={
                    active
                      ? "inline-flex h-9 items-center rounded-full bg-[#0F172A] px-3 text-xs font-semibold text-white"
                      : "inline-flex h-9 items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-xs font-semibold text-[#475569] transition hover:bg-white hover:text-[#0B1220]"
                  }
                >
                  {symptom}
                </button>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="inline-flex h-9 items-center gap-2 rounded-full bg-[#ECFEFF] px-3 text-xs font-bold text-[#0F766E]">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {resultCount} patients
            </span>
            <button
              type="button"
              onClick={() => onChange(defaultReportFilter)}
              className="inline-flex h-9 items-center rounded-full border border-[#E2E8F0] bg-white px-3 text-xs font-bold text-[#475569] transition hover:bg-[#F8FAFC]"
            >
              Clear filters
            </button>
          </div>
        </div>

        {activeChips.length ? (
          <div className="flex flex-wrap gap-2 border-t border-[#E2E8F0]/80 pt-3">
            {activeChips.map(([key, value]) => (
              <button
                key={`${key}-${value}`}
                type="button"
                onClick={() =>
                  key === "symptoms"
                    ? setFilter("symptoms", filters.symptoms.filter((symptom) => symptom !== value))
                    : setFilter(key, defaultReportFilter[key])
                }
                className="inline-flex h-8 items-center gap-2 rounded-full bg-[#F8FAFC] px-3 text-xs font-semibold text-[#334155] ring-1 ring-[#E2E8F0]"
              >
                {value}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
