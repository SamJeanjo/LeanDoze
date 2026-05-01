import { CalendarDays, Syringe } from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";

const fields = [
  ["Current GLP-1 medication", "Semaglutide"],
  ["Dose amount", "1.0 mg"],
  ["Injection schedule", "Every Tuesday morning"],
  ["Next dose date", "May 7, 2026"],
];

export default function MedicationPlanPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="MEDICATION SETUP"
        title="Keep dose details organized."
        description="Store medication, amount, injection schedule, next dose date, and missed dose status for tracking and reports."
        action={<StatusBadge tone="green">Plan active</StatusBadge>}
        activePath="/app"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <form className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <label key={label}>
                  <span className="text-sm font-semibold text-[#0B1220]">{label}</span>
                  <input
                    className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    defaultValue={value}
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B] ring-1 ring-[#E2E8F0]">
              LeanDoze tracks this plan for reminders, adherence, and clinic reports. Medication decisions should be made with a licensed clinician.
            </div>
            <button className="mt-6 h-12 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
              Save medication plan
            </button>
          </form>

          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
              <Syringe className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Next dose</h2>
            <div className="mt-4 rounded-[22px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-[#0F766E]" />
                <div>
                  <p className="font-semibold text-[#0B1220]">May 7, 2026</p>
                  <p className="mt-1 text-sm text-[#64748B]">Every Tuesday morning</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
