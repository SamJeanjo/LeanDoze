import { Droplet, Scale, Sparkles, Utensils } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Timeline } from "@/components/ui/Timeline";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { nonScaleWins, progressPhotos } from "@/lib/mockPatientData";
import { hydrationAdherence, proteinAdherence, weightChange } from "@/lib/patientInsights";

export function ProgressOverview({ profile, logs, full = false }: { profile: PatientProfileMock; logs: DailyLogMock[]; full?: boolean }) {
  const latest = logs[logs.length - 1];
  const protein = proteinAdherence(logs, profile.proteinGoal);
  const hydration = hydrationAdherence(logs, profile.hydrationGoal);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current weight" value={`${profile.currentWeight} lb`} helper={`${weightChange(profile)} lb since start`} progress={62} icon={Scale} tone="dark" />
        <MetricCard label="Protein adherence" value={`${protein}%`} helper={`${latest.proteinGrams}g logged today`} progress={protein} icon={Utensils} tone="green" />
        <MetricCard label="Hydration adherence" value={`${hydration}%`} helper={`${latest.hydrationOz}oz logged today`} progress={hydration} icon={Droplet} tone="teal" />
        <MetricCard label="Positive signal" value="Stable" helper="You're building consistency." progress={74} icon={Sparkles} tone="amber" />
      </div>

      {full ? (
        <>
          <PremiumCard className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Weight trend</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">Is this working?</h2>
            <div className="mt-8 flex h-72 items-end gap-2 rounded-[24px] bg-[#F8FAFC] p-5 ring-1 ring-[#E2E8F0]/80">
              {logs.map((log) => (
                <div key={log.date} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className="ld-bar w-full origin-bottom rounded-t-xl bg-gradient-to-t from-[#14B8A6] to-[#7DD3C7] shadow-[0_10px_22px_rgba(20,184,166,0.18)]" style={{ height: `${Math.max(18, Math.min(95, log.weight / 2.4))}%` }} />
                  <span className="hidden text-center text-[10px] font-semibold text-[#64748B] sm:inline">{log.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </PremiumCard>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <PremiumCard>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Non-scale wins</p>
              <div className="mt-5 grid gap-3">
                {nonScaleWins.map((win) => (
                  <div key={win} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm font-semibold text-[#07111F] ring-1 ring-[#E2E8F0]/80">
                    {win}
                  </div>
                ))}
              </div>
            </PremiumCard>
            <PremiumCard>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Progress photos</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {progressPhotos.map((photo) => (
                  <div key={photo.label} className={`aspect-[3/4] rounded-[24px] ${photo.tone} p-4 ring-1 ring-[#E2E8F0]`}>
                    <div className="flex h-full flex-col justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">Private</span>
                      <div>
                        <p className="font-semibold text-[#07111F]">{photo.label}</p>
                        <p className="text-sm text-[#64748B]">{photo.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </section>
          <PremiumCard>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Journey timeline</p>
            <div className="mt-5">
              <Timeline
                items={[
                  { title: "Started LeanDoze baseline", body: "Set medication, goals, and clinic report preferences." },
                  { title: "Protein streak", body: "Hit protein goal three days this week." },
                  { title: "Clinic report ready", body: "Your next report includes symptom notes and hydration trends." },
                ]}
              />
            </div>
          </PremiumCard>
        </>
      ) : null}
    </div>
  );
}
