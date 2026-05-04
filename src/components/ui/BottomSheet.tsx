"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type BottomSheetProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] sm:hidden">
      <button className="absolute inset-0 bg-[#07111F]/25 backdrop-blur-sm" aria-label="Close sheet" onClick={onClose} />
      <section className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[28px] bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-28px_80px_rgba(7,17,31,0.22)] transition-transform duration-[260ms] ease-out">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-[#CBD5E1]" />
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">Quick check-in</p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#07111F]">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E2E8F0] text-[#64748B]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
