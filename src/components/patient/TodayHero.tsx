import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TodayPlanMock } from "@/lib/mockPatientData";

export function TodayHero({ firstName, plan }: { firstName: string; plan: TodayPlanMock }) {
  return (
    <section className="relative z-0 overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-[#ECFEFF] p-5 shadow-[0_14px_36px_rgba(15,23,42,0.045)] sm:p-6 lg:p-7">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="teal">Day {plan.doseCycleDay} of your dose cycle</StatusBadge>
          <StatusBadge tone="success">You&apos;re on track this week</StatusBadge>
        </div>
        <p className="mt-5 text-base font-semibold text-[#64748B]">Good morning, {firstName}</p>
        <h1 className="mt-2 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#07111F] sm:text-5xl lg:text-6xl">
          Your GLP-1 day, simplified.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#475569]">
          Today, focus on protein, hydration, and one quick check-in.
        </p>
      </div>
    </section>
  );
}
