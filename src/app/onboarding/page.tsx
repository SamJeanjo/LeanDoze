import { DashboardShell, Footer } from "@/components/layout";

const fields = [
  { label: "Medication name", placeholder: "Semaglutide, Tirzepatide, etc." },
  { label: "Dose schedule", placeholder: "Every Tuesday morning" },
  { label: "Current weight", placeholder: "186 lb" },
  { label: "Goal weight", placeholder: "165 lb" },
  { label: "Protein goal", placeholder: "120g per day" },
  { label: "Hydration goal", placeholder: "90 oz per day" },
  { label: "Clinic code optional", placeholder: "LDZ-CLINIC" },
];

export default function Onboarding() {
  return (
    <div>
      <DashboardShell
        eyebrow="Onboarding"
        title="Set your GLP-1 support baseline."
        description="Create a personalized tracking plan for dose days, nutrition targets, hydration, and clinic visibility."
      >
        <form className="mx-auto max-w-3xl rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.label} className={field.label.includes("Clinic") ? "sm:col-span-2" : ""}>
                <span className="text-sm font-semibold text-slate-700">{field.label}</span>
                <input
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#FFF7ED] p-4 text-sm leading-6 text-slate-700 ring-1 ring-orange-100">
            LeanDoze uses these targets for tracking and reporting only. Medication decisions should always be made with a licensed clinician.
          </div>
          <button className="mt-6 h-12 w-full rounded-full bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800">
            Create my plan
          </button>
        </form>
      </DashboardShell>
      <Footer />
    </div>
  );
}
