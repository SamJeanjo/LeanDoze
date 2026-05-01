import { CalendarDays, Syringe } from "lucide-react";
import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { saveMedicationPlanAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function MedicationPlanPage() {
  const { patientProfile } = await getPatientAppState();
  const plan = patientProfile?.medicationPlans[0];

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <PatientLayout
        eyebrow="MEDICATION SETUP"
        title="Keep dose details organized."
        description="Store medication, amount, injection frequency, next dose date, and goals for tracking and reports."
        action={<StatusBadge tone={plan ? "green" : "amber"}>{plan ? "Plan active" : "Setup needed"}</StatusBadge>}
        activePath="/app/medication"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <form action={saveMedicationPlanAction} className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Current GLP-1 medication</span>
                <select name="medication" defaultValue={plan?.medication ?? "OZEMPIC"} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                  {["OZEMPIC", "WEGOVY", "MOUNJARO", "ZEPBOUND", "RYBELSUS", "SAXENDA", "OTHER"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Dose amount, mg</span>
                <input name="doseMg" type="number" step="0.01" defaultValue={plan?.doseMg ?? 0.25} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Injection frequency</span>
                <select name="frequency" defaultValue={plan?.frequency ?? "WEEKLY"} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                  <option value="WEEKLY">Weekly</option>
                  <option value="DAILY">Daily</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Next dose date</span>
                <input name="nextDoseDate" type="date" defaultValue={plan?.nextDoseDate?.toISOString().slice(0, 10)} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Start date</span>
                <input name="startDate" type="date" defaultValue={plan?.startDate?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10)} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Starting weight</span>
                <input name="startWeightLb" type="number" step="0.1" defaultValue={patientProfile?.startWeightLb ?? ""} placeholder="186" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Goal weight</span>
                <input name="goalWeightLb" type="number" step="0.1" defaultValue={patientProfile?.goalWeightLb ?? ""} placeholder="165" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Protein goal</span>
                <input name="proteinGoalGrams" type="number" defaultValue={patientProfile?.proteinGoalGrams ?? 120} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <label>
                <span className="text-sm font-semibold text-[#0B1220]">Hydration goal</span>
                <input name="hydrationGoalOz" type="number" defaultValue={patientProfile?.hydrationGoalOz ?? 90} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-[#0B1220]">Notes</span>
              <textarea name="notes" defaultValue={plan?.notes ?? ""} className="mt-2 min-h-28 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#64748B] ring-1 ring-[#E2E8F0]">
              LeanDoze tracks this plan for reminders, adherence, and clinic reports. Medication decisions should be made with a licensed clinician.
            </div>
            <button className="mt-6 h-12 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
              Save medication plan
            </button>
          </form>

          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
              <Syringe className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Next dose</h2>
            <div className="mt-4 rounded-[22px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-[#0F766E]" />
                <div>
                  <p className="font-semibold text-[#0B1220]">{plan?.nextDoseDate?.toLocaleDateString() ?? "Add next dose date"}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{plan?.frequency?.toLowerCase() ?? "Weekly"} tracking</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PatientLayout>
    </div>
  );
}
