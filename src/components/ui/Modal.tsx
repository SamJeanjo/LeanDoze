"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] hidden place-items-center bg-black/20 p-6 backdrop-blur-sm sm:grid">
      <section className="w-full max-w-lg rounded-[34px] bg-white p-6 shadow-[0_30px_90px_rgba(7,17,31,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F766E]">Quick check-in</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">{title}</h2>
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
