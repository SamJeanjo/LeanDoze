import { AlertTriangle, Droplet, HeartPulse, Scale, Utensils } from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { demoSafetyFlags } from "@/lib/safety";

const fields = [
  { label: "Weight", placeholder: "182.4 lb", icon: Scale },
  { label: "Protein", placeholder: "92g", icon: Utensils },
  { label: "Hydration", placeholder: "68 oz", icon: Droplet },
  { label: "Symptoms", placeholder: "Nausea, constipation, reflux", icon: HeartPulse },
];

export default function DailyCheckInPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="DAILY CHECK-IN"
        title="Log today’s GLP-1 signals."
        description="Track weight, protein, hydration, symptoms, severity, and missed doses for clinic-ready pattern detection."
        action={<StatusBadge tone="mint">Review this with your clinician.</StatusBadge>}
        activePath="/app"
      >
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.label}>
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                    <field.icon className="h-4 w-4 text-[#0F766E]" />
                    {field.label}
                  </span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Side effect severity</span>
                <select className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                  <option>None</option>
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Dose status</span>
                <select className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                  <option>On schedule</option>
                  <option>Taken</option>
                  <option>Missed</option>
                  <option>Skipped by clinician</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#0B1220]">Notes for your next visit</span>
              <textarea
                className="mt-2 min-h-32 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100"
                placeholder="What changed today?"
              />
            </label>
            <button className="mt-6 h-12 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
              Save check-in
            </button>
          </form>

          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Safety flags</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Pattern review</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {demoSafetyFlags.slice(0, 3).map((flag) => (
                <div key={flag.type} className="rounded-[18px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold tracking-[-0.015em] text-[#0B1220]">{flag.title}</p>
                    <StatusBadge tone={flag.severity === "URGENT" ? "coral" : "amber"}>{flag.severity}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{flag.summary}</p>
                  <p className="mt-3 text-sm font-semibold text-[#0F766E]">{flag.recommendation}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
