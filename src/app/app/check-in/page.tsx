import { AlertTriangle, Droplet, HeartPulse, Scale, Utensils } from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { saveDailyCheckInAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

const symptoms = [
  ["nausea", "Nausea"],
  ["vomiting", "Vomiting"],
  ["constipation", "Constipation"],
  ["diarrhea", "Diarrhea"],
  ["reflux", "Reflux"],
  ["fatigue", "Fatigue"],
  ["abdominalPain", "Abdominal pain"],
];

export default async function DailyCheckInPage() {
  const { patientProfile } = await getPatientAppState();

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="DAILY CHECK-IN"
        title="Log today’s GLP-1 signals."
        description="Track weight, protein, hydration, symptoms, severity, and missed doses for clinic-ready pattern detection."
        action={<StatusBadge tone="mint">Review this with your clinician.</StatusBadge>}
        activePath="/app/check-in"
      >
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form action={saveDailyCheckInAction} className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                  <Scale className="h-4 w-4 text-[#0F766E]" />
                  Weight
                </span>
                <input name="weightLb" type="number" step="0.1" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="182.4" />
              </label>
              <label>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                  <Utensils className="h-4 w-4 text-[#0F766E]" />
                  Protein grams
                </span>
                <input name="proteinGrams" type="number" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="92" required />
              </label>
              <label>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#0B1220]">
                  <Droplet className="h-4 w-4 text-[#0F766E]" />
                  Hydration ounces
                </span>
                <input name="hydrationOz" type="number" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="68" required />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Dose status</span>
                <select name="doseStatus" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                  <option value="on-schedule">On schedule</option>
                  <option value="taken">Taken</option>
                  <option value="missed">Missed</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Energy level</span>
                <input name="energyLevel" type="number" min="1" max="10" defaultValue="7" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Appetite level</span>
                <input name="appetiteLevel" type="number" min="1" max="10" defaultValue="5" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Mood level</span>
                <input name="moodLevel" type="number" min="1" max="10" defaultValue="7" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Movement minutes</span>
                <input name="movementMinutes" type="number" min="0" defaultValue="0" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0B1220]">
                <input name="strengthTraining" type="checkbox" className="size-4 accent-[#17C2B2]" />
                Strength training today
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#0B1220]">
                <input name="bowelMovement" type="checkbox" className="size-4 accent-[#17C2B2]" />
                Bowel movement today
              </label>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-[#0F766E]" />
                <h2 className="font-semibold text-[#0B1220]">Symptoms</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {symptoms.map(([value, label]) => (
                  <div key={value} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                      <input type="checkbox" name="symptoms" value={value} className="size-4 accent-[#17C2B2]" />
                      {label}
                    </label>
                    <select name={`${value}Severity`} defaultValue="MILD" className="mt-3 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-300">
                      <option value="NONE">None</option>
                      <option value="MILD">Mild</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="SEVERE">Severe</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#0B1220]">Notes for your next visit</span>
              <textarea name="notes" className="mt-2 min-h-32 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="What changed today?" />
            </label>
            <button className="mt-6 h-12 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
              Save check-in
            </button>
          </form>

          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Safety flags</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Pattern review</h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {(patientProfile?.riskFlags ?? []).slice(0, 4).map((flag) => (
                <div key={flag.id} className="rounded-[18px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold tracking-[-0.015em] text-[#0B1220]">{flag.title}</p>
                    <StatusBadge tone={flag.level === "URGENT" ? "coral" : "amber"}>{flag.level}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{flag.description}</p>
                  <p className="mt-3 text-sm font-semibold text-[#0F766E]">{flag.recommendation ?? "Review this with your clinician."}</p>
                </div>
              ))}
              {!patientProfile?.riskFlags.length ? <p className="text-sm leading-6 text-slate-500">No active flags yet. LeanDoze will surface patterns here after check-ins.</p> : null}
            </div>
          </section>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
