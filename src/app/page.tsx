import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Droplet,
  FileText,
  HeartPulse,
  LineChart,
  ShieldCheck,
  UsersRound,
  Utensils,
} from "lucide-react";
import { Footer, Navbar } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProgressBar } from "@/components/progress";
import { buildMetadata, faqItems, landingDescription, medicalDisclaimer, medicationTrademarkDisclaimer, primaryKeywords, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeanDoze — GLP-1 Tracker & Daily Companion App",
  description: landingDescription,
  path: "/",
  keywords: primaryKeywords,
});

const routineFeatures = [
  {
    icon: CalendarDays,
    title: "Dose day tracking",
    text: "Keep your GLP-1 dose rhythm, next dose date, and dose-day notes organized without turning the routine into a complicated spreadsheet.",
  },
  {
    icon: HeartPulse,
    title: "Symptom logging",
    text: "Log nausea, constipation, reflux, fatigue, vomiting, abdominal discomfort, and notes you may want to review with your clinician.",
  },
  {
    icon: Utensils,
    title: "Protein and hydration goals",
    text: "Track protein and hydration consistency so your daily plan reflects the basics that are easy to miss when appetite changes.",
  },
  {
    icon: LineChart,
    title: "Weight and progress tracking",
    text: "Follow weight trends, non-scale wins, consistency signals, and progress context in a calmer way than a generic weight loss tracker.",
  },
  {
    icon: FileText,
    title: "Clinician report preview",
    text: "Turn patient-entered logs into visit-ready summaries with dose logs, symptom notes, protein, hydration, and questions for your care team.",
  },
];

const medications = ["Ozempic", "Wegovy", "Mounjaro", "Zepbound", "Saxenda", "Victoza", "Rybelsus"];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LeanDoze",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description: landingDescription,
    url: siteUrl,
    offers: [
      { "@type": "Offer", name: "Patient Free", price: "0", priceCurrency: "USD" },
      { "@type": "Offer", name: "Patient Pro", price: "9", priceCurrency: "USD" },
      { "@type": "Offer", name: "Clinic Starter", price: "99", priceCurrency: "USD" },
    ],
    featureList: [
      "GLP-1 dose day tracking",
      "GLP-1 side effect tracking",
      "Protein and hydration tracking",
      "Weight progress tracking",
      "Clinician-ready reports",
      "Clinic dashboard for patient-entered data",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LeanDoze",
    url: siteUrl,
    logo: `${siteUrl}/brand/leandoze-logo.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LeanDoze",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function Home() {
  return (
    <div className="bg-[#F8FAFC] text-[#0F172A]">
      <JsonLd data={jsonLd} />
      <Navbar />
      <main>
        <section className="overflow-hidden bg-[#FFF7ED] bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.08),transparent_42%)]">
          <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
            <div>
              <p className="inline-flex rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-sm font-semibold text-teal-800 shadow-sm">
                GLP-1 tracker and daily companion app
              </p>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-7xl">
                GLP-1 tracking made simple for patients and clinics.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                LeanDoze helps patients manage dose days, symptoms, protein, hydration, weight progress, and clinician-ready reports — all in one daily companion app.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/onboarding" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_22px_40px_rgba(11,18,32,0.28)]">
                  Start tracking
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/for-clinics" className="inline-flex h-12 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/80 px-6 font-semibold text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-slate-300">
                  For clinics
                </Link>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-600">Tracking and support only. No diagnosis, treatment, or prescribing advice.</p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/70 bg-white p-4 shadow-[0_40px_120px_rgba(11,18,32,0.20)]">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Today&apos;s GLP-1 plan</p>
                      <h2 className="mt-1 text-2xl font-semibold">Dose cycle day 3</h2>
                    </div>
                    <span className="rounded-full bg-[#7DD3C7] px-3 py-1 text-xs font-semibold text-slate-950">On track</span>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {[
                      ["Hydrate early", "44 oz logged today"],
                      ["Protein first", "64g toward goal"],
                      ["Quick symptom check", "Ready for report"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="mt-1 text-sm text-slate-300">{value}</p>
                        </div>
                        <CheckCircle2 className="size-5 text-[#7DD3C7]" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Protein", value: "64g", icon: Utensils, progress: 62 },
                    { label: "Hydration", value: "44oz", icon: Droplet, progress: 55 },
                    { label: "Symptoms", value: "Logged", icon: HeartPulse, progress: 80 },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <metric.icon className="size-5 text-teal-700" />
                      <p className="mt-4 text-sm text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">{metric.value}</p>
                      <div className="mt-4">
                        <ProgressBar value={metric.progress} tone="mint" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Daily GLP-1 routine" title="Built for your GLP-1 routine" text="LeanDoze brings the pieces of GLP-1 tracking together: medication rhythm, side effect awareness, protein, hydration, weight progress, and report preparation." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {routineFeatures.map((feature) => (
              <article key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro eyebrow="Medication-aware tracking" title="Works with common GLP-1 medications" text="Patients can organize tracking around common GLP-1 medication names or enter another medication from their care plan." />
            <div className="mt-8 flex flex-wrap gap-3">
              {medications.map((name) => (
                <span key={name} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-500">{medicationTrademarkDisclaimer}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Beyond a basic tracker</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Why GLP-1 users need more than a tracker
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              "Appetite changes can make protein and hydration harder to keep consistent.",
              "Symptoms are easier to discuss when they are logged with timing, severity, and notes.",
              "Clinic conversations improve when patients can bring organized trends instead of memory alone.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <AudienceCard icon={ClipboardList} title="For patients" headline="Know what to focus on today." text="LeanDoze turns GLP-1 medication tracking into a daily plan for dose rhythm, protein, hydration, symptoms, progress, and clinician-ready notes." href="/onboarding" cta="Start tracking" />
            <AudienceCard icon={UsersRound} title="For clinics" headline="See patient-entered GLP-1 progress between visits." text="Clinics can review patient-entered trends, follow-up flags, adherence summaries, and reports without replacing clinical judgment." href="/for-clinics" cta="View clinic dashboard" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionIntro eyebrow="Clinician-ready reports" title="Your next visit, already organized." text="LeanDoze helps patients prepare a clear report from the data they choose to track and share." />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              {["Dose logs and timing", "Symptoms marked for clinician", "Protein and hydration adherence", "Weight trend and patient questions"].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-b-0">
                  <ShieldCheck className="size-5 text-teal-700" />
                  <h3 className="font-semibold text-slate-950">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionIntro eyebrow="FAQ" title="GLP-1 tracker questions" text="Clear answers about what LeanDoze does, what it tracks, and where clinical judgment belongs." />
            <div className="mt-10 divide-y divide-slate-200 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              {faqItems.map((item) => (
                <article key={item.question} className="p-6">
                  <h3 className="text-lg font-semibold text-slate-950">{item.question}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] sm:p-12">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Make your GLP-1 journey easier to track.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Start with your daily plan, then build a report your clinician can review with you.</p>
            <Link href="/onboarding" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">
              Start tracking with LeanDoze
              <ArrowRight className="size-4" />
            </Link>
            <p className="mt-6 text-sm text-slate-400">{medicalDisclaimer}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
      <p className="mt-5 max-w-3xl leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function AudienceCard({ icon: Icon, title, headline, text, href, cta }: { icon: LucideIcon; title: string; headline: string; text: string; href: string; cta: string }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
      <div className="grid size-12 place-items-center rounded-2xl bg-[#7DD3C7]/15 text-[#7DD3C7] ring-1 ring-[#7DD3C7]/30">
        <Icon className="size-5" />
      </div>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#7DD3C7]">{title}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{headline}</h3>
      <p className="mt-4 leading-7 text-slate-300">{text}</p>
      <Link href={href} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5">
        {cta}
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}
