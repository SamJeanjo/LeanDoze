import { Download, FileText } from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { demoSafetyFlags } from "@/lib/safety";

const reportRows = [
  ["Dose adherence", "94%", "1 missed dose in the review period"],
  ["Protein average", "96g/day", "Below target on 2 days"],
  ["Hydration average", "72oz/day", "Low hydration pattern detected"],
  ["Weight trend", "-1.8% / week", "Within current review threshold"],
];

export default function DoctorReportPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="DOCTOR REPORT"
        title="Clinic-ready progress summary."
        description="Generate a clear report for your clinician with adherence, trends, symptoms, and safety flags."
        action={
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
            <Download className="h-4 w-4" />
            Export report
          </button>
        }
        activePath="/app"
      >
        <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">May review</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#050816]">Ava Martinez</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                This report is a tracking summary for clinician review. It does not provide medical diagnosis, treatment, or prescribing advice.
              </p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {reportRows.map(([label, value, helper]) => (
              <div key={label} className="rounded-[22px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
                <p className="text-sm font-medium text-[#64748B]">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#050816]">{value}</p>
                <p className="mt-1 text-sm text-[#64748B]">{helper}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#050816]">Safety flags</h3>
            <div className="mt-4 space-y-3">
              {demoSafetyFlags.map((flag) => (
                <div key={flag.type} className="rounded-[18px] border border-[#E2E8F0]/80 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#0B1220]">{flag.title}</p>
                    <StatusBadge tone={flag.severity === "WATCH" ? "mint" : "amber"}>{flag.severity}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{flag.summary}</p>
                  <p className="mt-3 text-sm font-semibold text-[#0F766E]">{flag.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </DashboardShell>
      <Footer />
    </div>
  );
}
