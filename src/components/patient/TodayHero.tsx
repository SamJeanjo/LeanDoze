import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TodayPlanMock } from "@/lib/mockPatientData";

export function TodayHero({ firstName, plan }: { firstName: string; plan: TodayPlanMock }) {
  return (
    <section className="relative z-10 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
      <div className="relative z-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="teal">Day {plan.doseCycleDay} of your dose cycle</StatusBadge>
          <StatusBadge tone="success">You&apos;re on track this week</StatusBadge>
        </div>
        <p className="mt-7 text-lg font-semibold text-[#64748B]">Good morning, {firstName}</p>
        <h1 className="mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#07111F] sm:text-7xl">
          Your GLP-1 day, simplified.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#475569] sm:text-lg sm:leading-8">
          Today, focus on protein, hydration, and one quick check-in.
        </p>
      </div>
    </section>
  );
}
