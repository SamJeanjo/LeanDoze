"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ClipboardCheck,
  Download,
  FileText,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Target,
  UsersRound,
  Weight,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomReportBuilder } from "@/components/reports/CustomReportBuilder";
import { DemographicsReport } from "@/components/reports/DemographicsReport";
import { FollowUpQueue } from "@/components/reports/FollowUpQueue";
import { PatientDrilldownDrawer } from "@/components/reports/PatientDrilldownDrawer";
import { PrescriptionPerformance } from "@/components/reports/PrescriptionPerformance";
import { ReportFilterBar } from "@/components/reports/ReportFilterBar";
import { ReportKpiCard } from "@/components/reports/ReportKpiCard";
import { SymptomIntelligence } from "@/components/reports/SymptomIntelligence";
import {
  defaultReportFilter,
  reportLogs,
  reportPatients,
  type ClinicReportPatient,
  type ReportFilter,
} from "@/lib/mockClinicReports";
import { filterPatients, formatPercent, getKpis, groupByDate, logsForPatients } from "@/lib/reportUtils";

const tabs = ["Overview", "Symptoms", "Prescriptions", "Segments", "Follow-Up", "Builder"] as const;

type Tab = (typeof tabs)[number];

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_14px_42px_rgba(15,23,42,0.055)]">
      <div>
        <h3 className="font-semibold text-[#07111F]">{title}</h3>
        <p className="mt-1 text-sm text-[#64748B]">{subtitle}</p>
      </div>
      <div className="mt-4 h-72">{children}</div>
    </section>
  );
}

export function ClinicReportsAnalytics() {
  const [filters, setFilters] = useState<ReportFilter>(defaultReportFilter);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [selectedPatient, setSelectedPatient] = useState<ClinicReportPatient | null>(null);

  const patients = useMemo(() => filterPatients(reportPatients, reportLogs, filters), [filters]);
  const logs = useMemo(() => logsForPatients(reportLogs, patients), [patients]);
  const kpis = useMemo(() => getKpis(patients, logs), [patients, logs]);
  const trend = useMemo(() => groupByDate(logs).slice(-14), [logs]);

  const setMedicationFilter = (medication: string) => {
    setFilters((current) => ({ ...current, medication }));
    setActiveTab("Follow-Up");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-[#E2E8F0]/80 bg-[#07111F] p-6 text-white shadow-[0_30px_90px_rgba(7,17,31,0.24)] xl:p-8">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#14B8A6]/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7DD3C7]">Clinic Reports</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] xl:text-6xl">
              Clinic Reports
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
              Analyze GLP-1 progress, adherence, symptoms, and outcomes across your patient panel.
            </p>
            <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-400">
              These reports summarize patient-entered tracking data and are intended to support clinical review. LeanDoze does not provide diagnosis, treatment, or prescribing advice.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[430px]">
            <select
              value={filters.dateRange}
              onChange={(event) => setFilters({ ...filters, dateRange: event.target.value as ReportFilter["dateRange"] })}
              className="h-11 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-semibold text-white outline-none backdrop-blur"
            >
              <option className="text-[#07111F]" value="7d">Last 7 days</option>
              <option className="text-[#07111F]" value="30d">Last 30 days</option>
              <option className="text-[#07111F]" value="90d">Last 90 days</option>
              <option className="text-[#07111F]" value="custom">Custom</option>
            </select>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
              <FileText className="h-4 w-4" />
              Export CSV
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#07111F] transition hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4" />
              Generate clinician summary
            </button>
          </div>
        </div>
      </section>

      <ReportFilterBar filters={filters} onChange={setFilters} resultCount={patients.length} />

      <nav className="flex gap-2 overflow-x-auto rounded-[22px] border border-[#E2E8F0]/80 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "h-10 shrink-0 rounded-2xl bg-[#07111F] px-4 text-sm font-semibold text-white"
                : "h-10 shrink-0 rounded-2xl px-4 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#07111F]"
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      {!patients.length ? (
        <section className="rounded-[28px] border border-dashed border-[#CBD5E1] bg-white p-12 text-center shadow-sm">
          <p className="text-xl font-semibold text-[#07111F]">No report data matches these filters.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#64748B]">
            Clear filters or broaden the date range to see patient trends, symptom patterns, and follow-up queues.
          </p>
          <button onClick={() => setFilters(defaultReportFilter)} className="mt-6 h-11 rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white">
            Clear filters
          </button>
        </section>
      ) : null}

      {patients.length ? (
        <>
          {(activeTab === "Overview" || activeTab === "Follow-Up") && (
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <ReportKpiCard label="Active patients" value={`${kpis.activePatients}`} trend="+12% vs previous" status="Panel in range" icon={UsersRound} tone="teal" />
              <ReportKpiCard label="Average weight change" value={`${kpis.avgWeightChange.toFixed(1)} lb`} trend="-1.6 lb vs previous" status="Tracking trend" icon={Weight} tone="green" />
              <ReportKpiCard label="Patients reporting symptoms" value={`${kpis.symptomaticPatients}`} trend="+2 this period" status="Review symptom mix" icon={HeartPulse} tone="amber" />
              <ReportKpiCard label="Missed dose rate" value={formatPercent(kpis.missedDoseRate)} trend="-3% vs previous" status="Dose rhythm" icon={ClipboardCheck} tone={kpis.missedDoseRate ? "coral" : "green"} />
              <ReportKpiCard label="Protein adherence" value={formatPercent(kpis.proteinAdherence)} trend="+7% vs previous" status="Nutrition anchor" icon={Target} tone="green" />
              <ReportKpiCard label="Hydration adherence" value={formatPercent(kpis.hydrationAdherence)} trend="-4% vs previous" status="Watch hydration" icon={Activity} tone="teal" />
              <ReportKpiCard label="Flagged for follow-up" value={`${kpis.followUpPatients}`} trend="Needs review" status="Open queue" icon={ShieldAlert} tone={kpis.followUpPatients ? "coral" : "green"} />
              <ReportKpiCard label="Avg Muscle Protection" value={`${Math.round(kpis.avgMuscleScore)}`} trend="+3 pts vs previous" status="Lean mass support" icon={Sparkles} tone="navy" />
            </section>
          )}

          {activeTab === "Overview" && (
            <section className="grid gap-5 xl:grid-cols-2">
              <ChartCard title="Weight change over time" subtitle="Average patient-entered weight across selected panel.">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <CartesianGrid vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="weight" stroke="#14B8A6" fill="#7DD3C7" fillOpacity={0.25} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Average adherence over time" subtitle="Dose taken signal from patient logs.">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="adherence" stroke="#22C55E" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Symptom frequency over time" subtitle="Total symptom events in selected range.">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <CartesianGrid vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="symptoms" stroke="#FB7185" fill="#FB7185" fillOpacity={0.18} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Muscle Protection Score trend" subtitle="Composite of protein, hydration, activity, and weight pace.">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="muscle" stroke="#0F172A" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </section>
          )}

          {(activeTab === "Symptoms" || activeTab === "Overview") && <SymptomIntelligence patients={patients} logs={logs} />}
          {(activeTab === "Prescriptions" || activeTab === "Overview") && <PrescriptionPerformance patients={patients} logs={logs} onMedicationSelect={setMedicationFilter} />}
          {activeTab === "Segments" && <DemographicsReport patients={patients} />}
          {activeTab === "Follow-Up" && <FollowUpQueue patients={patients} logs={logs} onPatientSelect={setSelectedPatient} />}
          {activeTab === "Builder" && <CustomReportBuilder />}
        </>
      ) : null}

      <PatientDrilldownDrawer patient={selectedPatient} logs={reportLogs} onClose={() => setSelectedPatient(null)} />
    </div>
  );
}
