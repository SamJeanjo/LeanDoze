"use client";

import { useState } from "react";
import { Building2, ChevronRight, Clock3, ShieldCheck } from "lucide-react";
import { ClinicConnectionDrawer, type ClinicConnection, type ClinicConnectionStatus } from "@/components/patient/ClinicConnectionDrawer";

const visual: Record<
  ClinicConnectionStatus,
  { title: string; compactTitle: string; body: string; compactBody: string; action: string; icon: typeof ShieldCheck; dot: string; iconClassName: string }
> = {
  not_connected: {
    title: "Connect with your doctor or clinic",
    compactTitle: "Connect clinic",
    body: "Share reports when you choose.",
    compactBody: "Share by choice",
    action: "Connect",
    icon: Building2,
    dot: "bg-[#CBD5E1]",
    iconClassName: "bg-[#F8FAFC] text-[#64748B] ring-[#E2E8F0]",
  },
  pending: {
    title: "Clinic invite pending",
    compactTitle: "Invite pending",
    body: "Share reports when accepted.",
    compactBody: "Awaiting reply",
    action: "Details",
    icon: Clock3,
    dot: "bg-[#F59E0B]",
    iconClassName: "bg-[#FFF7ED] text-amber-700 ring-orange-100",
  },
  connected: {
    title: "Connected with Montreal Wellness Clinic",
    compactTitle: "Clinic connected",
    body: "Dr. Sarah Patel",
    compactBody: "Montreal Wellness",
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
  const title = isReport ? copy.title : copy.compactTitle;
  const body = isReport ? copy.body : copy.compactBody;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isReport
            ? "relative z-0 w-full rounded-[28px] border border-slate-200/70 bg-white px-5 py-4 text-left shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)] active:scale-[0.99]"
            : "relative z-0 w-full rounded-2xl border border-slate-200/70 bg-white px-3 py-3 text-left shadow-[0_12px_34px_rgba(15,23,42,0.045)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-50 active:scale-[0.99]"
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className={`${isReport ? "h-11 w-11" : "h-9 w-9 rounded-xl"} grid shrink-0 place-items-center rounded-2xl ring-1 ${copy.iconClassName}`}>
            <Icon className={isReport ? "h-5 w-5" : "h-4 w-4"} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${copy.dot}`} />
              <p className={`${isReport ? "text-base" : "text-[13px]"} truncate font-semibold tracking-[-0.02em] text-[#07111F]`}>{title}</p>
            </div>
            <p className={`${isReport ? "text-sm" : "text-[11px]"} mt-0.5 truncate leading-5 text-[#64748B]`}>{body}</p>
          </div>
          {isReport ? <span className="hidden text-xs font-semibold text-[#0F766E] sm:inline">{copy.action}</span> : null}
          <ChevronRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
        </div>
        {isReport ? <p className="mt-4 text-sm leading-6 text-[#64748B]">Reports are shared only when you choose.</p> : null}
      </button>
      <ClinicConnectionDrawer connection={connection} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
