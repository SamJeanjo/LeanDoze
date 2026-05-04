import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function InsightCallout({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "cream" | "coral" }) {
  const classes = {
    teal: "bg-[#ECFEFF] text-[#0F766E] ring-[#99F6E4]/80",
    cream: "bg-[#FFF7ED] text-amber-800 ring-orange-100",
    coral: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className={`flex gap-3 rounded-2xl p-4 text-sm font-semibold leading-6 ring-1 ${classes[tone]}`}>
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
