import { Dumbbell, ImagePlus, Ruler, ShieldCheck } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { muscleProtectionScore } from "@/lib/patientInsights";

export function MuscleProtection({ profile, logs }: { profile: PatientProfileMock; logs: DailyLogMock[] }) {
  const score = muscleProtectionScore(logs, profile);
  const latest = logs[logs.length - 1];
  const proteinProgress = Math.min(100, Math.round((latest.proteinGrams / profile.proteinGoal) * 100));
  const activityStreak = logs.slice(-7).filter((log) => log.activityCompleted).length;

  return (
    <PremiumCard className="p-6 lg:p-8">
      <div className="relative z-0 grid grid-cols-12 gap-6 xl:items-center">
        <div className="col-span-12 xl:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Muscle protection</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Support muscle retention habits.</h2>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">{score.explanation}</p>
        </div>
        <div className="col-span-12 grid gap-5 sm:grid-cols-12 sm:items-center xl:col-span-8">
          <div className="sm:col-span-4">
            <ProgressRing value={score.score} label={score.label} />
          </div>
          <div className="grid gap-3 sm:col-span-8">
            {[
              { label: "Protein consistency", value: `${proteinProgress}% today`, icon: ShieldCheck, progress: proteinProgress },
              { label: "Strength activity streak", value: `${activityStreak} days this week`, icon: Dumbbell, progress: Math.round((activityStreak / 7) * 100) },
              { label: "Measurements", value: "Add waist or hip when ready", icon: Ruler, progress: 40 },
              { label: "Progress photo reminder", value: "Optional private check-in", icon: ImagePlus, progress: 25 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="relative z-0 rounded-3xl border border-slate-200/70 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ECFEFF] text-[#0F766E]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-[#64748B]">{item.value}</p>
                    </div>
                  </div>
                  <ProgressBar value={item.progress} tone="teal" className="mt-3" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
