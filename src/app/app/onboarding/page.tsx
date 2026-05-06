import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { savePatientOnboardingAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";
import { glp1DoseScheduleOptions, glp1MedicationOptions, scheduleForValue } from "@/lib/glp1-options";

export const dynamic = "force-dynamic";

const concerns = [
  ["nausea", "Nausea"],
  ["constipation", "Constipation"],
  ["fatigue", "Fatigue"],
  ["low-appetite", "Low appetite"],
  ["muscle-loss", "Muscle loss"],
  ["dehydration", "Dehydration"],
];

export default async function PatientOnboardingPage() {
  const { patientProfile } = await getPatientAppState();
  const plan = patientProfile?.medicationPlans[0];
  const selectedSchedule = scheduleForValue(plan?.doseSchedule) ?? glp1DoseScheduleOptions.find((option) => option.doseMg === plan?.doseMg && option.frequency === plan?.frequency);
  const selectedConcerns = new Set(patientProfile?.mainConcerns ?? []);

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <PatientLayout
        eyebrow="Premium Onboarding"
        title={patientProfile ? "Tune your personalized GLP-1 plan." : "Build your daily command center."}
        description={patientProfile ? "Your saved inputs are here. Edit only what changed, then LeanDoze updates today's plan." : "Set medication rhythm, goals, concerns, reminders, and sharing preference in one guided setup."}
        action={<StatusBadge tone={patientProfile ? "green" : "mint"}>{patientProfile ? "Saved profile" : "Tracking only"}</StatusBadge>}
        activePath="/app/dashboard"
      >
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Medication rhythm", "Name, dose, schedule"],
            ["2", "Daily goals", "Protein, hydration, concerns"],
            ["3", "Trust controls", "Reminders and sharing"],
          ].map(([step, title, text]) => (
            <div key={step} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
              <span className="grid size-8 place-items-center rounded-full bg-[#07111F] text-xs font-bold text-white">{step}</span>
              <p className="mt-4 text-sm font-semibold text-[#07111F]">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <form action={savePatientOnboardingAction} className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-[#E2E8F0]/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <section className="border-b border-slate-100 p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F766E]">Medication rhythm</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Anchor the plan around your actual dose schedule.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Medication name</span>
              <select name="medication" defaultValue={plan?.medication ?? "OZEMPIC"} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                {glp1MedicationOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Custom medication name if OTHER</span>
              <input name="customMedicationName" defaultValue={plan?.customName ?? ""} placeholder="Medication name" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Dose schedule</span>
              <select name="doseSchedule" defaultValue={selectedSchedule?.value ?? plan?.doseSchedule ?? "OZEMPIC_025_WEEKLY_4"} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                {glp1DoseScheduleOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Dose frequency</span>
              <select name="frequency" defaultValue={plan?.frequency ?? selectedSchedule?.frequency ?? "WEEKLY"} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Dose amount, mg</span>
              <input name="doseMg" type="number" step="0.01" defaultValue={plan?.doseMg ?? selectedSchedule?.doseMg ?? 0.25} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Next dose date</span>
              <input name="nextDoseDate" type="date" defaultValue={plan?.nextDoseDate?.toISOString().slice(0, 10)} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            </div>
          </section>

          <section className="border-b border-slate-100 p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F766E]">Daily goals</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Turn the first screen into a personal plan.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Starting weight</span>
              <input name="startWeightLb" type="number" step="0.1" defaultValue={patientProfile?.startWeightLb ?? ""} placeholder="186" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Goal weight</span>
              <input name="goalWeightLb" type="number" step="0.1" defaultValue={patientProfile?.goalWeightLb ?? ""} placeholder="165" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Protein goal grams</span>
              <input name="proteinGoalGrams" type="number" defaultValue={patientProfile?.proteinGoalGrams ?? 120} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Hydration goal oz</span>
              <input name="hydrationGoalOz" type="number" defaultValue={patientProfile?.hydrationGoalOz ?? 90} className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold text-[#0B1220]">Clinic code optional</span>
              <input name="clinicCode" placeholder="LDZ-CLINIC" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm uppercase tracking-[0.08em] outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
              <span className="mt-2 block text-xs leading-5 text-[#64748B]">
                Adding a code does not connect your clinic automatically. You choose when to share your reports.
              </span>
            </label>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
            <h2 className="font-semibold text-[#0B1220]">Main concerns</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {concerns.map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800">
                  <input type="checkbox" name="mainConcerns" value={value} defaultChecked={selectedConcerns.has(value)} className="size-4 accent-[#17C2B2]" />
                  {label}
                </label>
              ))}
            </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F766E]">Trust controls</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Choose how LeanDoze supports you.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["dose", "Dose day reminders"],
                ["symptom", "Day-after-dose symptom check"],
                ["hydration", "Hydration nudge"],
                ["report", "Weekly report prep"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm font-semibold text-slate-800">
                  <input type="checkbox" name="reminderPreferences" value={value} defaultChecked className="size-4 accent-[#17C2B2]" />
                  {label}
                </label>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-teal-100 bg-[#ECFEFF] p-4 text-sm leading-6 text-slate-700">
              Sharing stays consent-first. You can export your data, revoke clinic access, or delete your account from settings.
            </div>
            <div className="mt-4 rounded-2xl bg-[#FFF7ED] p-4 text-sm leading-6 text-slate-700 ring-1 ring-orange-100">
              LeanDoze uses these targets for tracking and reporting only. Medication decisions should always be made with a licensed clinician.
            </div>
            <button className="mt-6 h-12 w-full rounded-full bg-[#0B1220] px-5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
              {patientProfile ? "Save and update today" : "Create my personalized plan"}
            </button>
          </section>
        </form>
      </PatientLayout>
    </div>
  );
}
