"use client";

import { useState } from "react";
import { Building2, ChevronRight, Clock3, ShieldCheck } from "lucide-react";
import { ClinicConnectionDrawer, type ClinicConnection, type ClinicConnectionStatus } from "@/components/patient/ClinicConnectionDrawer";

const visual: Record<ClinicConnectionStatus, { label: string; title: string; body: string; icon: typeof ShieldCheck; className: string; iconClassName: string }> = {
  not_connected: {
    label: "Not connected",
    title: "Connect your clinic",
    body: "You choose when to share your reports.",
    icon: Building2,
    className: "bg-white text-[#07111F] ring-[#E2E8F0]",
    iconClassName: "bg-[#F8FAFC] text-[#64748B] ring-[#E2E8F0]",
  },
  pending: {
    label: "Pending",
    title: "Clinic invite pending",
    body: "No data is shared until accepted.",
    icon: Clock3,
    className: "bg-[#FFF7ED] text-[#07111F] ring-orange-100",
    iconClassName: "bg-white text-amber-700 ring-orange-100",
  },
  connected: {
    label: "Connected",
    title: "Clinic connected",
    body: "You choose when to share your reports.",
    icon: ShieldCheck,
    className: "bg-[#07111F] text-white ring-white/10",
    iconClassName: "bg-white/10 text-[#7DD3C7] ring-white/10",
  },
};

const defaultConnection: ClinicConnection = {
  status: "connected",
  clinicName: "Code10Rx Clinic",
  clinicianName: "Dr. Maya Chen",
  connectionDate: "2026-04-18",
  sharedDataCategories: ["Clinician reports", "Weight trends", "Protein and hydration summaries", "Symptom notes", "Dose adherence"],
};

export function ClinicConnectionCard({ connection = defaultConnection }: { connection?: ClinicConnection }) {
  const [open, setOpen] = useState(false);
  const copy = visual[connection.status];
  const Icon = copy.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full rounded-[26px] p-4 text-left ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] active:scale-[0.99] ${copy.className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ${copy.iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <ChevronRight className={connection.status === "connected" ? "mt-2 h-4 w-4 text-white/60" : "mt-2 h-4 w-4 text-[#64748B]"} />
        </div>
        <p className={connection.status === "connected" ? "mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#7DD3C7]" : "mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0F766E]"}>
          {copy.label}
        </p>
        <p className="mt-2 text-base font-semibold tracking-[-0.02em]">{copy.title}</p>
        <p className={connection.status === "connected" ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-[#64748B]"}>
          {copy.body}
        </p>
      </button>
      <ClinicConnectionDrawer connection={connection} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
