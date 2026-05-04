import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "dark" | "cream" | "mint";
};

const tones = {
  light: "bg-white text-[#07111F]",
  dark: "bg-white text-[#07111F]",
  cream: "bg-white text-[#07111F]",
  mint: "bg-white text-[#07111F]",
};

export function PremiumCard({ children, className = "", id, tone = "light" }: PremiumCardProps) {
  return (
    <section id={id} className={`relative z-0 overflow-hidden rounded-[28px] border border-slate-200/70 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-6 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}
