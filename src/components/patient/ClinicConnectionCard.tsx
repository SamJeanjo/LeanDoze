"use client";

import { useState } from "react";
import { Building2, ChevronRight, Clock3, ShieldCheck } from "lucide-react";
import { ClinicConnectionDrawer, type ClinicConnection, type ClinicConnectionStatus } from "@/components/patient/ClinicConnectionDrawer";

const visual: Record<ClinicConnectionStatus, { title: string; body: string; action: string; icon: typeof ShieldCheck; dot: string; iconClassName: string }> = {
  not_connected: {
    title: "Connect with your doctor or clinic",
    body: "Share reports when you choose.",
    action: "Connect",
    icon: Building2,
    dot: "bg-[#CBD5E1]",
    iconClassName: "bg-[#F8FAFC] text-[#64748B] ring-[#E2E8F0]",
  },
  pending: {
    title: "Clinic invite pending",
    body: "Share reports when accepted.",
    action: "Details",
    icon: Clock3,
    dot: "bg-[#F59E0B]",
    iconClassName: "bg-[#FFF7ED] text-amber-700 ring-orange-100",
  },
  connected: {
    title: "Connected with Montreal Wellness Clinic",
    body: "Dr. Sarah Patel",
    action: "Details",
    icon: ShieldCheck,
    dot: "bg-[#14B8A6]",
    iconClassName: "bg-[#ECFEFF] text-[#0F766E] ring-[#99F6E4]/70",
  },
};

const defaultConnection: ClinicConnection = {
  status: "connected",
  clinicName: "Montreal Wellness Clinic",
  clinicianName: "Dr. Sarah Patel",
  connectionDate: "2026-04-18",
  sharedDataCategories: ["Clinician reports", "Weight trends", "Protein and hydration summaries", "Symptom notes", "Dose adherence"],
};

export function ClinicConnectionCard({ connection = defaultConnection, variant = "compact" }: { connection?: ClinicConnection; variant?: "compact" | "report" }) {
  const [open, setOpen] = useState(false);
  const copy = visual[connection.status];
  const Icon = copy.icon;
  const isReport = variant === "report";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isReport
            ? "relative z-10 w-full rounded-3xl border border-slate-200/70 bg-white px-5 py-4 text-left shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
            : "relative z-10 w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-left shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F8FAFC] active:scale-[0.99]"
        }
      >
        <div className="flex items-center gap-3">
          <div className={`${isReport ? "h-11 w-11" : "h-9 w-9"} grid shrink-0 place-items-center rounded-2xl ring-1 ${copy.iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${copy.dot}`} />
              <p className={`${isReport ? "text-base" : "text-sm"} truncate font-semibold tracking-[-0.02em] text-[#07111F]`}>{copy.title}</p>
            </div>
            <p className={`${isReport ? "text-sm" : "text-xs"} mt-1 truncate leading-5 text-[#64748B]`}>{copy.body}</p>
          </div>
          <span className="hidden text-xs font-semibold text-[#0F766E] sm:inline">{copy.action}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
        </div>
        {isReport ? <p className="mt-4 text-sm leading-6 text-[#64748B]">Reports are shared only when you choose.</p> : null}
      </button>
      <ClinicConnectionDrawer connection={connection} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
