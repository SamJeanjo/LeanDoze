import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { savePatientOnboardingAction } from "@/lib/app-actions";

export const dynamic = "force-dynamic";

const concerns = [
  ["nausea", "Nausea"],
  ["constipation", "Constipation"],
  ["fatigue", "Fatigue"],
  ["low-appetite", "Low appetite"],
  ["muscle-loss", "Muscle loss"],
  ["dehydration", "Dehydration"],
];

export default function PatientOnboardingPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="Patient Onboarding"
        title="Set your GLP-1 support baseline."
        description="Create a patient-owned profile for daily goals, dose rhythm, and clinic-ready reports."
        action={<StatusBadge tone="mint">Tracking only</StatusBadge>}
        activePath="/app/dashboard"
      >
        <form action={savePatientOnboardingAction} className="mx-auto max-w-4xl rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Medication name</span>
              <select name="medication" defaultValue="OZEMPIC" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                {["OZEMPIC", "WEGOVY", "MOUNJARO", "ZEPBOUND", "RYBELSUS", "SAXENDA", "OTHER"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Custom medication name if OTHER</span>
              <input name="customMedicationName" placeholder="Medication name" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Dose amount, mg</span>
              <input name="doseMg" type="number" step="0.01" defaultValue="0.25" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Dose frequency</span>
              <select name="frequency" defaultValue="WEEKLY" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100">
                <option value="WEEKLY">Weekly</option>
                <option value="DAILY">Daily</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Next dose date</span>
              <input name="nextDoseDate" type="date" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Starting weight</span>
              <input name="startWeightLb" type="number" step="0.1" placeholder="186" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Goal weight</span>
              <input name="goalWeightLb" type="number" step="0.1" placeholder="165" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Protein goal grams</span>
              <input name="proteinGoalGrams" type="number" defaultValue="120" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
            <label>
              <span className="text-sm font-semibold text-[#0B1220]">Hydration goal oz</span>
              <input name="hydrationGoalOz" type="number" defaultValue="90" className="mt-2 h-12 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm outline-none transition focus:border-[#17C2B2] focus:bg-white focus:ring-4 focus:ring-teal-100" />
            </label>
          </div>

          <div className="mt-6 rounded-[24px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
            <h2 className="font-semibold text-[#0B1220]">Main concerns</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {concerns.map(([value, label]) => (
                <label key={value} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800">
                  <input type="checkbox" name="mainConcerns" value={value} className="size-4 accent-[#17C2B2]" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#FFF7ED] p-4 text-sm leading-6 text-slate-700 ring-1 ring-orange-100">
            LeanDoze uses these targets for tracking and reporting only. Medication decisions should always be made with a licensed clinician.
          </div>
          <button className="mt-6 h-12 w-full rounded-full bg-[#0B1220] px-5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
            Create my plan
          </button>
        </form>
      </DashboardShell>
      <Footer />
    </div>
  );
}
