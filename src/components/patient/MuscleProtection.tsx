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
    <PremiumCard tone="dark" className="border-white/10 p-6 lg:p-8">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#14B8A6]/20 blur-3xl" />
      <div className="relative grid gap-7 xl:grid-cols-[220px_1fr] xl:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7DD3C7]">Muscle protection</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Support muscle retention habits.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{score.explanation}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-[160px_1fr] sm:items-center">
          <ProgressRing value={score.score} label={score.label} dark />
          <div className="grid gap-3">
            {[
              { label: "Protein consistency", value: `${proteinProgress}% today`, icon: ShieldCheck, progress: proteinProgress },
              { label: "Strength activity streak", value: `${activityStreak} days this week`, icon: Dumbbell, progress: Math.round((activityStreak / 7) * 100) },
              { label: "Measurements", value: "Add waist or hip when ready", icon: Ruler, progress: 40 },
              { label: "Progress photo reminder", value: "Optional private check-in", icon: ImagePlus, progress: 25 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 text-[#7DD3C7]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.value}</p>
                    </div>
                  </div>
                  <ProgressBar value={item.progress} tone="teal" className="mt-3 bg-white/10" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
