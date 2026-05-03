import { Dumbbell, ImagePlus, Ruler, ShieldCheck } from "lucide-react";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { muscleProtectionScore } from "@/lib/patientInsights";

export function MuscleProtectionCard({ profile, logs }: { profile: PatientProfileMock; logs: DailyLogMock[] }) {
  const score = muscleProtectionScore(logs, profile);
  const latest = logs[logs.length - 1];
  const proteinProgress = Math.min(100, Math.round((latest.proteinGrams / profile.proteinGoal) * 100));
  const activityStreak = logs.slice(-7).filter((log) => log.activityCompleted).length;

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#07111F] p-6 text-white shadow-[0_28px_80px_rgba(7,17,31,0.24)]">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#14B8A6]/20 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7DD3C7]">Muscle Protection</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">Protect strength while weight changes.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Support muscle retention habits with protein consistency, strength activity, and progress check-ins.</p>

        <div className="mt-7 grid gap-4 xl:grid-cols-[140px_1fr]">
          <div className="grid h-32 w-32 place-items-center rounded-full bg-white/8 text-center ring-1 ring-white/10">
            <div>
              <p className="text-4xl font-semibold">{score.score}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7DD3C7]">Score</p>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              { label: "Protein goal progress", value: `${proteinProgress}% today`, icon: ShieldCheck },
              { label: "Strength activity streak", value: `${activityStreak} days this week`, icon: Dumbbell },
              { label: "Body measurement reminder", value: "Add waist or hip measurement", icon: Ruler },
              { label: "Progress photo reminder", value: "Optional private photo check-in", icon: ImagePlus },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 text-[#7DD3C7]">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
