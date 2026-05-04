import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer, Navbar } from "@/components/layout";
import type { SeoPageContent } from "@/lib/seo-pages";
import { medicalDisclaimer } from "@/lib/seo";

export function SeoContentPage({ page }: { page: SeoPageContent }) {
  const Icon = page.icon;

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <main>
        <section className="bg-[#FFF7ED] bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.08),transparent_42%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
            <div>
              <p className="inline-flex rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm">
                {page.eyebrow}
              </p>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-7xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{page.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/onboarding" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                  {page.cta}
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/pricing" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/80 px-6 font-semibold text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
                  See plans
                </Link>
              </div>
            </div>
            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.10)]">
              <div className="grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Icon className="size-6" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">What LeanDoze helps organize</h2>
              <div className="mt-5 grid gap-3">
                {page.highlights.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-teal-700" />
                      <h3 className="font-semibold text-slate-950">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
                <div className="mt-5 space-y-5 text-lg leading-8 text-slate-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {page.disclaimer ? (
            <div className="mt-12 rounded-2xl border border-orange-100 bg-[#FFF7ED] p-5 text-sm leading-6 text-amber-900">
              {page.disclaimer}
            </div>
          ) : null}

          <section className="mt-12 rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <h2 className="text-3xl font-semibold tracking-tight">Track your GLP-1 routine with more clarity.</h2>
            <p className="mt-4 leading-7 text-slate-300">LeanDoze helps patients organize daily logs and prepare reports for clinician review.</p>
            <Link href="/onboarding" className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">
              {page.cta}
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-6 text-sm leading-6 text-slate-400">{medicalDisclaimer}</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
