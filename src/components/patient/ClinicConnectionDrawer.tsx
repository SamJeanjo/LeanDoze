"use client";

import { X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type ClinicConnectionStatus = "not_connected" | "pending" | "connected";

export type ClinicConnection = {
  status: ClinicConnectionStatus;
  clinicName?: string;
  clinicianName?: string;
  connectionDate?: string;
  sharedDataCategories?: string[];
};

const statusCopy = {
  not_connected: {
    label: "Not connected",
    tone: "slate" as const,
    title: "Connect with your doctor or clinic",
    body: "Share reports when you choose.",
  },
  pending: {
    label: "Pending",
    tone: "amber" as const,
    title: "Invite pending",
    body: "Your clinician has not accepted the connection yet. Reports are not shared automatically.",
  },
  connected: {
    label: "Connected",
    tone: "teal" as const,
    title: "Connected with Montreal Wellness Clinic",
    body: "Dr. Sarah Patel",
  },
};

export function ClinicConnectionDrawer({
  connection,
  open,
  onClose,
}: {
  connection: ClinicConnection;
  open: boolean;
  onClose: () => void;
}) {
  const copy = statusCopy[connection.status];
  const categories = connection.sharedDataCategories ?? ["Clinician reports", "Weight trends", "Protein and hydration summaries", "Symptom notes", "Dose adherence"];

  return (
    <div className={open ? "fixed inset-0 z-[100]" : "pointer-events-none fixed inset-0 z-[100]"}>
      <button
        aria-label="Close clinic connection drawer"
        onClick={onClose}
        className={open ? "absolute inset-0 bg-black/20 opacity-100 backdrop-blur-sm transition-opacity duration-300" : "absolute inset-0 bg-black/0 opacity-0 transition-opacity duration-300"}
      />
      <aside
        className={
          open
            ? "absolute right-0 top-0 z-[101] h-full w-full max-w-md translate-x-0 overflow-y-auto bg-white p-6 shadow-[-24px_0_70px_rgba(7,17,31,0.18)] transition-transform duration-300 ease-out sm:rounded-l-[34px]"
            : "absolute right-0 top-0 z-[101] h-full w-full max-w-md translate-x-full overflow-y-auto bg-white p-6 shadow-[-24px_0_70px_rgba(7,17,31,0.18)] transition-transform duration-300 ease-out sm:rounded-l-[34px]"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <StatusBadge tone={copy.tone}>{copy.label}</StatusBadge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[#07111F]">{copy.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">{copy.body}</p>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#07111F]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7 space-y-3 rounded-[26px] bg-[#F8FAFC] p-4 ring-1 ring-[#E2E8F0]/80">
          <InfoRow label="Clinic" value={connection.clinicName ?? "No clinic selected"} />
          <InfoRow label="Clinician" value={connection.clinicianName ?? "Not assigned yet"} />
          <InfoRow label="Connection date" value={connection.connectionDate ? new Date(connection.connectionDate).toLocaleDateString() : "Not connected"} />
        </div>

        <section className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Shared data</p>
          <div className="mt-3 grid gap-2">
            {categories.map((category) => (
              <div key={category} className="rounded-2xl bg-white p-4 text-sm font-semibold text-[#07111F] ring-1 ring-[#E2E8F0]/80">
                {category}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-[#ECFEFF] p-4 ring-1 ring-[#99F6E4]/70">
          <p className="text-sm font-semibold text-[#0F766E]">Privacy</p>
          <p className="mt-2 text-sm leading-6 text-[#475569]">
            Reports are shared only when you choose. LeanDoze does not auto-connect you to a clinic from a code or invite without an explicit action.
          </p>
        </section>

        {connection.status === "connected" ? (
          <button className="mt-6 min-h-12 w-full rounded-full border border-rose-100 bg-rose-50 px-5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100">
            Disconnect access
          </button>
        ) : (
          <a href="/app/invite-doctor" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5">
            Invite clinic
          </a>
        )}
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-[#E2E8F0]/80">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#64748B]">{label}</span>
      <span className="text-right text-sm font-semibold text-[#07111F]">{value}</span>
    </div>
  );
}
