import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Sparkles }: EmptyStateProps) {
  return (
    <PremiumCard className="text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/80">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#07111F]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">{description}</p>
    </PremiumCard>
  );
}
