import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, ShieldCheck } from "lucide-react";
import { FeatureCard, PricingCard } from "@/components/cards";
import { Footer, Navbar } from "@/components/layout";
import { Hero } from "@/components/hero";
import { ProgressBar } from "@/components/progress";
import { featureCards, pricingPlans } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <Hero />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Clinic Dashboard</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                See what is happening between visits.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                Clinics get a quiet operating view for weight trend summaries, side effect alerts, missed doses, and adherence so visits start with context.
              </p>
              <Link href="/clinic" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Open clinic demo
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { icon: CalendarDays, label: "Missed dose alerts", value: "12" },
                  { icon: BarChart3, label: "Avg adherence", value: "86%" },
                  { icon: ShieldCheck, label: "Stable patients", value: "104" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <item.icon className="size-5 text-teal-700" />
                    <p className="mt-5 text-sm text-slate-500">{item.label}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-950">Cohort adherence</p>
                  <p className="text-sm font-medium text-green-600">+6% this month</p>
                </div>
                <div className="mt-6 space-y-5">
                  {["Dose completion", "Protein logging", "Hydration logging"].map((label, index) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-600">{label}</span>
                        <span className="font-semibold text-slate-950">{[88, 74, 81][index]}%</span>
                      </div>
                      <ProgressBar value={[88, 74, 81][index]} tone={index === 1 ? "green" : "mint"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Pricing Preview</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Ready for patients, ready for clinics.
              </h2>
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-2 font-semibold text-slate-950">
              View all plans
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
