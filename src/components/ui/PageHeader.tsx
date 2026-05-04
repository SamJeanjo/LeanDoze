import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#07111F] sm:text-6xl">{title}</h1>
        {description ? <p className="mt-5 max-w-2xl text-base leading-7 text-[#475569] sm:text-lg sm:leading-8">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
