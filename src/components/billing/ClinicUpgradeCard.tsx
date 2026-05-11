import { ArrowRight, BarChart3, UsersRound } from "lucide-react";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { PremiumCard } from "@/components/ui/PremiumCard";

export function ClinicUpgradeCard({ compact = false }: { compact?: boolean }) {
  return (
    <PremiumCard className={compact ? "p-5" : "p-6 lg:p-8"}>
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Clinic plan</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Upgrade for the full clinic command center.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Unlock patient panel analytics, follow-up queues, reporting workflows, and growth capacity for GLP-1 care teams.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFEFF] px-3 py-1 text-[#0F766E]">
              <UsersRound className="size-4" />
              Starter up to 25 active patients
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              <BarChart3 className="size-4" />
              Growth up to 100 active patients
            </span>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[410px]">
          <div className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-slate-500">Clinic Starter</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">$149/mo</p>
            <CheckoutButton
              plan="clinic-starter"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              Upgrade plan
              <ArrowRight className="size-4" />
            </CheckoutButton>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-500">Clinic Growth</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">$299/mo</p>
            <CheckoutButton
              plan="clinic-growth"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#14B8A6] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#0F9F95] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Choose Growth
            </CheckoutButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
