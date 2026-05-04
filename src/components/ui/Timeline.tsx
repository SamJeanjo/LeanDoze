type TimelineItem = {
  title: string;
  body: string;
  meta?: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title} className="relative rounded-2xl bg-[#F8FAFC] p-4 pl-12 ring-1 ring-[#E2E8F0]/80">
          <span className="absolute left-4 top-5 h-3 w-3 rounded-full bg-[#14B8A6] shadow-[0_0_0_5px_rgba(20,184,166,0.12)]" />
          <p className="font-semibold text-[#07111F]">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#64748B]">{item.body}</p>
          {item.meta ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F766E]">{item.meta}</p> : null}
        </div>
      ))}
    </div>
  );
}
