import { CalendarClock } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import type { PatientProfileMock, TodayPlanMock } from "@/lib/mockPatientData";
import { doseCycleCopy } from "@/lib/patientInsights";

export function DoseCycle({ profile, plan }: { profile: PatientProfileMock; plan: TodayPlanMock }) {
  return (
    <PremiumCard className="p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Dose cycle</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">Day {plan.doseCycleDay} of your dose rhythm</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">Many people notice patterns across the week. Use this as a tracking guide, not medical certainty.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3 ring-1 ring-[#E2E8F0]">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ECFEFF] text-[#0F766E]">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B]">Next dose</p>
            <p className="text-sm font-semibold text-[#07111F]">{new Date(profile.nextDoseDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, index) => {
          const day = index + 1;
          const active = day === plan.doseCycleDay;
          return (
            <div key={day} className={active ? "rounded-2xl bg-[#07111F] p-3 text-white shadow-[0_16px_35px_rgba(7,17,31,0.22)]" : "rounded-2xl bg-[#F8FAFC] p-3 text-[#64748B] ring-1 ring-[#E2E8F0]/80"}>
              <p className={active ? "text-xs font-bold text-[#7DD3C7]" : "text-xs font-bold"}>Day {day}</p>
              <div className={active ? "mt-3 h-2 rounded-full bg-[#14B8A6]" : "mt-3 h-2 rounded-full bg-[#CBD5E1]"} />
              <p className="mt-3 hidden text-xs leading-5 xl:block">{doseCycleCopy(day).appetite}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          ["Expected appetite", doseCycleCopy(plan.doseCycleDay).appetite],
          ["Symptom watch window", doseCycleCopy(plan.doseCycleDay).watch],
          ["Medication", `${profile.brand} ${profile.dose}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-[#E2E8F0]/80">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
            <p className="mt-2 text-sm font-semibold text-[#07111F]">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-[#64748B]">Consider discussing persistent or concerning symptoms with your clinician. LeanDoze does not provide medical advice.</p>
    </PremiumCard>
  );
}
