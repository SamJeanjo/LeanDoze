import type { ReactNode } from "react";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "success" | "teal" | "amber" | "coral" | "slate" | "dark";
  className?: string;
};

const tones = {
  success: "bg-[#F0FDF4] text-[#15803D] ring-[#BBF7D0]",
  teal: "bg-[#ECFEFF] text-[#0F766E] ring-[#99F6E4]",
  amber: "bg-[#FFF7ED] text-amber-800 ring-orange-100",
  coral: "bg-rose-50 text-rose-700 ring-rose-100",
  slate: "bg-[#F8FAFC] text-[#475569] ring-[#E2E8F0]",
  dark: "bg-[#07111F] text-white ring-[#07111F]",
};

export function StatusBadge({ children, tone = "slate", className = "" }: StatusBadgeProps) {
  return <span className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-bold ring-1 ${tones[tone]} ${className}`}>{children}</span>;
}
