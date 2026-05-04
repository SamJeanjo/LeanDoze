"use client";

type SegmentedTabsProps<T extends string> = {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
};

export function SegmentedTabs<T extends string>({ tabs, active, onChange }: SegmentedTabsProps<T>) {
  return (
    <nav className="flex gap-2 overflow-x-auto rounded-3xl bg-white/90 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={
            active === tab
              ? "min-h-11 shrink-0 rounded-2xl bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(7,17,31,0.18)]"
              : "min-h-11 shrink-0 rounded-2xl px-5 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#07111F]"
          }
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
