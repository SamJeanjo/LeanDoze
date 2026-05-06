import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardList,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Footer, Navbar } from "@/components/layout";
import { pricingPlans } from "@/lib/mock-data";

const featurePillars = [
  {
    icon: ClipboardList,
    title: "Daily Today command center",
    text: "Dose cycle day, next dose, hydration, protein, symptoms, and one-tap logging on the first screen.",
  },
  {
    icon: FileText,
    title: "Clinician-ready PDF export",
    text: "Branded visit summaries with timeline, symptoms by dose day, adherence, weight, protein, hydration, and questions.",
  },
  {
    icon: BellRing,
    title: "Real reminders",
    text: "Dose day, day-after-dose symptoms, hydration nudges, and weekly report prep built for retention.",
  },
  {
    icon: UsersRound,
    title: "Clinic dashboard from real data",
    text: "Follow-up queues, risk flags, missed-dose trends, symptom spikes, and low-logging patients.",
  },
  {
    icon: Sparkles,
    title: "Premium guided onboarding",
    text: "Medication, dose schedule, goals, concerns, reminder rhythm, sharing preference, then a personalized plan.",
  },
  {
    icon: LockKeyhole,
    title: "Trust and compliance polish",
    text: "Consent-first sharing, export/delete controls, careful safety language, and clear privacy expectations.",
  },
];

const planCtas: Record<string, { href: string; label: string }> = {
  Free: { href: "/onboarding", label: "Start free" },
  "Patient Pro": { href: "/onboarding?plan=pro", label: "Start Pro" },
  "Clinic Starter": { href: "/for-clinics", label: "Start clinic" },
  "Clinic Growth": { href: "/for-clinics", label: "Talk to us" },
};

export default function PricingPage() {
  return (
    <div className="bg-[#F8FAFC] text-[#07111F]">
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid min-h-[72vh] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
            <div className="self-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Subscriptions</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#050816] sm:text-7xl">
                Premium GLP-1 tracking with a clinic-grade upgrade path.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Start free, upgrade patients for smarter reports and reminders, and let clinics pay for the between-visit signal that saves team time.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/onboarding" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#07111F] px-6 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(7,17,31,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/for-clinics" className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-[#07111F] shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                  Clinic plans
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-4 sm:grid-cols-2">
              {[
                ["Patient Pro", "$7.99/mo", "$59/year annual anchor"],
                ["Clinic Starter", "$149/mo", "Up to 25 active patients"],
                ["Clinic Growth", "$299/mo", "Up to 100 active patients"],
                ["Free", "$0", "Daily habit builder"],
              ].map(([label, value, helper]) => (
                <div key={label} className="rounded-[28px] border border-slate-200 bg-[#F8FAFC] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#07111F]">{value}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-4">
            {pricingPlans.map((plan) => {
              const cta = planCtas[plan.name] ?? { href: "/onboarding", label: "Choose plan" };

              return (
                <article
                  key={plan.name}
                  className={
                    plan.featured
                      ? "relative overflow-hidden rounded-[28px] border border-[#07111F] bg-[#07111F] p-6 text-white shadow-[0_28px_90px_rgba(7,17,31,0.28)]"
                      : "rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
                  }
                >
                  {plan.featured ? (
                    <div className="mb-5 inline-flex rounded-full bg-[#7DD3C7] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#07111F]">
                      Best patient value
                    </div>
                  ) : null}
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className={plan.featured ? "mt-3 text-sm leading-6 text-slate-300" : "mt-3 text-sm leading-6 text-slate-600"}>
                    {plan.description}
                  </p>
                  <div className="mt-8">
                    <p className="text-5xl font-semibold tracking-[-0.05em]">{plan.price}</p>
                    <p className={plan.featured ? "mt-2 text-sm text-slate-300" : "mt-2 text-sm text-slate-500"}>{plan.period}</p>
                  </div>
                  <ul className="mt-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-5">
                        <CheckCircle2 className={plan.featured ? "mt-0.5 size-4 shrink-0 text-[#7DD3C7]" : "mt-0.5 size-4 shrink-0 text-[#0F766E]"} />
                        <span className={plan.featured ? "text-slate-100" : "text-slate-700"}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={cta.href}
                    className={
                      plan.featured
                        ? "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-[#07111F] transition hover:-translate-y-0.5 hover:bg-slate-100"
                        : "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#07111F] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                    }
                  >
                    {cta.label}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">What premium means</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#050816] sm:text-5xl">
                Charge for outcomes, not checkboxes.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Free keeps the daily habit alive. Pro unlocks the report, reminders, and insight layer. Clinics pay for panel visibility and faster follow-up.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featurePillars.map((feature) => (
                <article key={feature.title} className="rounded-[28px] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white text-[#0F766E] ring-1 ring-slate-200">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-[#07111F]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[32px] bg-[#07111F] p-6 text-white shadow-[0_30px_100px_rgba(7,17,31,0.24)] lg:grid-cols-[1fr_0.75fr] lg:p-10">
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-[#7DD3C7]/15 text-[#7DD3C7] ring-1 ring-[#7DD3C7]/30">
                <ShieldCheck className="size-5" />
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Founding offer: $39/year for early Patient Pro users.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Use this as a launch lever, then grandfather early users. It creates urgency without cheapening the long-term $59/year anchor.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
              {["Free removes acquisition friction", "Pro monetizes reports and reminders", "Clinics pay for time saved", "Compliance polish builds trust"].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 py-4 last:border-b-0">
                  <CheckCircle2 className="size-5 text-[#7DD3C7]" />
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
