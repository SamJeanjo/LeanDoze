import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#07111F] sm:text-6xl sm:leading-[0.95] sm:tracking-[-0.055em]">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
