"use client";

import type { LucideIcon } from "lucide-react";

type FloatingActionButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
};

export function FloatingActionButton({ label, icon: Icon, onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(7,17,31,0.24)] transition active:scale-[0.98] lg:hidden"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
