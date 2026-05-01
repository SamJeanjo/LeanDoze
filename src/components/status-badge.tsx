import { cn } from "@/lib/utils";

const tones = {
  green: "border-green-200 bg-green-50 text-green-700",
  mint: "border-teal-200 bg-teal-50 text-teal-700",
  coral: "border-rose-200 bg-rose-50 text-rose-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  navy: "border-slate-200 bg-slate-50 text-slate-700",
};

export function StatusBadge({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
