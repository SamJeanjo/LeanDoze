import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "dark" | "cream" | "mint";
};

const tones = {
  light: "bg-white text-[#07111F] shadow-[0_20px_60px_rgba(15,23,42,0.07)]",
  dark: "bg-[#07111F] text-white shadow-[0_28px_80px_rgba(7,17,31,0.24)]",
  cream: "bg-[#FFF7ED] text-[#07111F] shadow-[0_18px_50px_rgba(245,158,11,0.08)]",
  mint: "bg-[#ECFEFF] text-[#07111F] shadow-[0_18px_50px_rgba(20,184,166,0.08)]",
};

export function PremiumCard({ children, className = "", id, tone = "light" }: PremiumCardProps) {
  return (
    <section id={id} className={`relative overflow-hidden rounded-3xl border border-[#E2E8F0]/70 p-5 sm:p-6 ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}
