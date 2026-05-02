import { CopySummaryButton } from "@/components/copy-summary-button";
import type { PatientNarrative } from "@/lib/report-narrative";

function narrativeText(narrative: PatientNarrative) {
  return [
    `Clinical summary (${narrative.rangeLabel})`,
    "",
    "Overall:",
    narrative.overall,
    "",
    "Key patterns:",
    ...narrative.keyPatterns.map((pattern) => `- ${pattern}`),
    "",
    "Discussion points:",
    ...narrative.discussionPoints.map((point) => `- ${point}`),
    "",
    "Disclaimer:",
    narrative.disclaimer,
  ].join("\n");
}

export function ClinicalSummaryCard({
  narrative,
  hasData,
  addToReportAction,
  generateThirtyDayAction,
}: {
  narrative: PatientNarrative;
  hasData: boolean;
  addToReportAction?: React.ReactNode;
  generateThirtyDayAction?: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Clinical Summary</p>
            <span className="inline-flex items-center rounded-full border border-[#99F6E4] bg-[#ECFEFF] px-3 py-1 text-xs font-semibold text-[#0F766E]">
              {narrative.rangeLabel}
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#050816]">
            Clinician-ready narrative
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
            A concise, safe interpretation of recent adherence, nutrition, hydration, symptoms, energy, and flags.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <CopySummaryButton text={narrativeText(narrative)} />
          {addToReportAction}
          {generateThirtyDayAction}
        </div>
      </div>

      {!hasData ? (
        <div className="mt-8 rounded-[22px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-sm leading-6 text-[#64748B]">
          Not enough patient data yet. The narrative will populate after check-ins are logged.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <div className="rounded-[22px] border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F766E]">Overall</h3>
            <p className="mt-4 text-sm leading-6 text-[#334155]">{narrative.overall}</p>
          </div>

          <div className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F766E]">Key patterns</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {narrative.keyPatterns.slice(0, 8).map((item) => (
                <p key={item} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#475569] ring-1 ring-[#E2E8F0]/80">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F766E]">Discussion points</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {narrative.discussionPoints.map((point) => (
                <span key={point} className="inline-flex rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm font-semibold text-[#334155]">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-[#FFF7ED] p-4 text-sm leading-6 text-slate-700 ring-1 ring-orange-100 lg:col-span-2">
            {narrative.disclaimer}
          </div>
        </div>
      )}
    </section>
  );
}

