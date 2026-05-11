import { ArrowRight, BellRing, FileText, Sparkles } from "lucide-react";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { PremiumCard } from "@/components/ui/PremiumCard";

export function PatientUpgradeCard({ compact = false }: { compact?: boolean }) {
  return (
    <PremiumCard className={compact ? "p-5" : "p-6 lg:p-8"}>
      <div className={compact ? "grid gap-4" : "grid gap-6 lg:grid-cols-[1fr_auto]"}>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#99F6E4] bg-[#ECFEFF] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0F766E]">
            <Sparkles className="size-3.5" />
            Patient Pro
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Upgrade when you want smarter reports.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Patient Pro adds deeper clinician-ready summaries, reminder controls, and export polish while keeping sharing optional.
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex gap-3">
              <FileText className="mt-0.5 size-4 text-[#0F766E]" />
              <span>14/30-day PDF report value</span>
            </div>
            <div className="flex gap-3">
              <BellRing className="mt-0.5 size-4 text-[#0F766E]" />
              <span>Dose, hydration, and report reminders</span>
            </div>
          </div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-4 lg:min-w-56">
          <p className="text-sm font-semibold text-slate-500">Patient Pro</p>
          <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#07111F]">$7.99</p>
          <p className="text-sm text-slate-500">per month or $59/year</p>
          <div className="mt-4 grid gap-2">
            <CheckoutButton
              plan="patient-pro-monthly"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              Upgrade monthly
              <ArrowRight className="size-4" />
            </CheckoutButton>
            <CheckoutButton
              plan="patient-pro-yearly"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 ease-out hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Save with yearly
            </CheckoutButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
