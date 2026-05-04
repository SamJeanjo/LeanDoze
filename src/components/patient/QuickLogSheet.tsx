"use client";

import { X } from "lucide-react";

type QuickLogSheetProps = {
  type: string | null;
  onClose: () => void;
};

const symptomChips = ["nausea", "constipation", "fatigue", "heartburn", "low appetite", "dizziness"];

export function QuickLogSheet({ type, onClose }: QuickLogSheetProps) {
  if (!type) return null;

  const isSymptoms = type === "Symptoms";

  return (
    <div className="fixed inset-0 z-[100]">
      <button className="absolute inset-0 bg-[#07111F]/25 backdrop-blur-sm" aria-label="Close quick log" onClick={onClose} />
      <section className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white p-6 shadow-[0_-30px_100px_rgba(15,23,42,0.22)] transition-transform duration-[260ms] ease-out sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:rounded-[28px]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#CBD5E1]" />
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">Quick log</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#07111F]">{type}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSymptoms ? (
          <div className="mt-5">
            <div className="flex flex-wrap gap-2">
              {symptomChips.map((chip) => (
                <button key={chip} className="min-h-11 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#334155] transition hover:bg-[#ECFEFF] hover:text-[#0F766E]">
                  {chip}
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["mild", "moderate", "severe"].map((severity) => (
                <button key={severity} className="min-h-12 rounded-2xl border border-[#E2E8F0] bg-white text-sm font-semibold capitalize text-[#0B1220]">
                  {severity}
                </button>
              ))}
            </div>
            <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl bg-[#FFF7ED] px-4 text-sm font-semibold text-amber-800 ring-1 ring-orange-100">
              <input type="checkbox" className="h-4 w-4 accent-[#14B8A6]" />
              I want to mention this to my clinician
            </label>
            <p className="mt-4 text-xs leading-5 text-[#64748B]">
              If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <div className="rounded-[24px] bg-[#F8FAFC] p-5 ring-1 ring-[#E2E8F0]">
              <input type="range" min="0" max="150" defaultValue="64" className="w-full accent-[#14B8A6]" />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#64748B]">0</span>
                <span className="text-3xl font-semibold tracking-[-0.04em] text-[#07111F]">64</span>
                <span className="text-sm font-semibold text-[#64748B]">150</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["+10", "+20", "+30"].map((item) => (
                <button key={item} className="min-h-11 rounded-2xl bg-[#ECFEFF] text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4]">
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={onClose} className="mt-6 h-12 w-full rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
          Save log
        </button>
        <p className="mt-3 text-center text-sm font-semibold text-[#0F766E]">Logged. We&apos;ll include this in your next report.</p>
      </section>
    </div>
  );
}
