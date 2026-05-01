import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { ProgressBar } from "@/components/progress";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-8 flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  helper,
  progress,
  icon: Icon,
  tone = "mint",
}: {
  label: string;
  value: string;
  helper: string;
  progress?: number;
  icon: LucideIcon;
  tone?: "mint" | "green" | "coral" | "navy";
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
      {typeof progress === "number" ? (
        <div className="mt-5">
          <ProgressBar value={progress} tone={tone} />
        </div>
      ) : null}
    </div>
  );
}

export function PatientCard({
  patient,
}: {
  patient: {
    id: string;
    name: string;
    medication: string;
    weightChange: string;
    adherence: number;
    symptoms: string;
    status: string;
    alert: string;
    lastDose: string;
  };
}) {
  const tone = patient.alert === "symptom" ? "coral" : patient.alert === "dose" ? "amber" : "green";

  return (
    <div className="grid gap-5 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-[1.3fr_0.8fr_0.8fr_auto] lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-semibold text-slate-950">{patient.name}</h3>
          <StatusBadge tone={tone}>{patient.status}</StatusBadge>
        </div>
        <p className="mt-1 text-sm text-slate-500">{patient.medication}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Weight</p>
        <p className="mt-1 font-semibold text-slate-900">{patient.weightChange}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-slate-400">Adherence</p>
        <p className="mt-1 font-semibold text-slate-900">{patient.adherence}%</p>
      </div>
      <Link
        href={`/clinic/patients/${patient.id}`}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        View Patient
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

export function PricingCard({
  plan,
}: {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    featured?: boolean;
  };
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
        plan.featured
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-950",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        {plan.featured ? <StatusBadge tone="mint">Popular</StatusBadge> : null}
      </div>
      <p className={cn("mt-3 text-sm leading-6", plan.featured ? "text-slate-300" : "text-slate-500")}>
        {plan.description}
      </p>
      <div className="mt-8 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
        <span className={cn("pb-1 text-sm", plan.featured ? "text-slate-300" : "text-slate-500")}>
          {plan.period}
        </span>
      </div>
      <ul className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm">
            <span className={cn("mt-1 size-2 rounded-full", plan.featured ? "bg-[#7DD3C7]" : "bg-[#22C55E]")} />
            <span className={plan.featured ? "text-slate-100" : "text-slate-700"}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/onboarding"
        className={cn(
          "mt-8 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition",
          plan.featured
            ? "bg-white text-slate-950 hover:bg-slate-100"
            : "bg-slate-950 text-white hover:bg-slate-800",
        )}
      >
        Choose plan
      </Link>
    </div>
  );
}
