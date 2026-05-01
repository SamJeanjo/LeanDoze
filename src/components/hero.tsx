import Link from "next/link";
import { ArrowRight, CheckCircle2, Droplet, HeartPulse, ShieldPlus, Utensils } from "lucide-react";
import { ProgressBar } from "@/components/progress";
import { todayPlan } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[#FFF7ED] bg-[radial-gradient(circle_at_30%_20%,rgba(23,194,178,0.06),transparent_40%)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:-mt-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-20 lg:pt-10">
        <div className="lg:-translate-y-5">
          <p className="inline-flex rounded-full border border-teal-200 bg-white/70 px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm">
            GLP-1 support for patients and clinics
          </p>
          <h1 className="mt-7 max-w-4xl text-[64px] font-semibold leading-[0.92] tracking-[-0.055em] text-slate-950">
            Take GLP-1
            <br />
            with confidence.
          </h1>
          <p className="mt-6 max-w-[480px] text-lg leading-8 text-slate-700">
            LeanDoze helps patients manage dose days, protein, hydration, side effects, and progress while giving clinics a clear view between visits.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_22px_40px_rgba(11,18,32,0.28)]">
              Start tracking
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/clinic" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/80 px-6 font-semibold text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-slate-300">
              For clinics
            </Link>
          </div>
        </div>
        <div className="relative lg:-ml-8 xl:-ml-10">
          <div className="scale-[1.02] rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_40px_120px_rgba(11,18,32,0.25)] backdrop-blur">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Today Plan</p>
                  <h2 className="mt-1 text-2xl font-semibold">Dose week day 3</h2>
                </div>
                <span className="rounded-full bg-[#7DD3C7] px-3 py-1 text-xs font-semibold text-slate-950">
                  On track
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                {todayPlan.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-300">{item.value}</p>
                    </div>
                    <CheckCircle2 className="size-5 text-[#7DD3C7]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Protein", value: "92g", icon: Utensils, progress: 77 },
                { label: "Hydration", value: "68oz", icon: Droplet, progress: 76 },
                { label: "Symptoms", value: "Mild", icon: HeartPulse, progress: 32 },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <metric.icon className="size-5 text-teal-700" />
                  <p className="mt-4 text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{metric.value}</p>
                  <div className="mt-4">
                    <ProgressBar value={metric.progress} tone={metric.label === "Symptoms" ? "coral" : "mint"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 right-7 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-200 sm:flex">
            <div className="grid size-10 place-items-center rounded-xl bg-green-50 text-green-700">
              <ShieldPlus className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Lean mass guardrails</p>
              <p className="text-xs text-slate-500">Protein and strength trend stable</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
