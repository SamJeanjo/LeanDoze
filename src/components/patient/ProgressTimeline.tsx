import { Camera, CheckCircle2, Flag, Sparkles } from "lucide-react";
import type { DailyLogMock, PatientProfileMock } from "@/lib/mockPatientData";
import { nonScaleWins, progressPhotos } from "@/lib/mockPatientData";
import { weightChange } from "@/lib/patientInsights";

export function ProgressTimeline({ profile, logs }: { profile: PatientProfileMock; logs: DailyLogMock[] }) {
  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Progress</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">Progress that feels human.</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">Weight is only one part of the story. Track wins that keep you going when the scale is quiet.</p>
          </div>
          <div className="rounded-2xl bg-[#ECFEFF] px-4 py-3 text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4]">
            {weightChange(profile)} lb since start
          </div>
        </div>

        <div className="mt-8 flex h-72 items-end gap-2 rounded-[24px] bg-[#F8FAFC] p-5 ring-1 ring-[#E2E8F0]">
          {logs.map((log) => (
            <div key={log.date} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div className="w-full rounded-t-xl bg-gradient-to-t from-[#14B8A6] to-[#7DD3C7] shadow-[0_10px_22px_rgba(20,184,166,0.18)]" style={{ height: `${Math.max(18, Math.min(95, log.weight / 2.4))}%` }} />
              <span className="hidden text-center text-[10px] font-semibold text-[#64748B] sm:inline">{log.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF7ED] text-amber-700 ring-1 ring-orange-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-[#07111F]">Non-scale wins</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {nonScaleWins.map((win) => (
              <div key={win} className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-[#E2E8F0]">
                <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                <p className="text-sm font-semibold text-[#0B1220]">{win}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
              <Camera className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-[#07111F]">Progress photos</h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {progressPhotos.map((photo) => (
              <div key={photo.label} className={`aspect-[3/4] rounded-[24px] ${photo.tone} p-4 ring-1 ring-[#E2E8F0]`}>
                <div className="flex h-full flex-col justify-between">
                  <Camera className="h-5 w-5 text-[#64748B]" />
                  <div>
                    <p className="font-semibold text-[#07111F]">{photo.label}</p>
                    <p className="text-sm text-[#64748B]">{photo.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F0FDF4] text-[#16A34A] ring-1 ring-[#BBF7D0]">
            <Flag className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[#07111F]">Journey timeline</h2>
        </div>
        <div className="mt-6 space-y-4">
          {[
            ["Started LeanDoze baseline", "Set medication, goals, and clinic report preferences."],
            ["Protein streak", "Hit protein goal three days this week."],
            ["Clinic report ready", "Your next report includes symptom notes and hydration trends."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="font-semibold text-[#07111F]">{title}</p>
              <p className="mt-1 text-sm leading-6 text-[#64748B]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
