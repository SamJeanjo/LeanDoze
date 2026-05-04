export function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] ring-1 ring-[#E2E8F0]/70">
      <div className="h-4 w-32 animate-pulse rounded-full bg-[#E2E8F0]" />
      <div className="mt-5 h-8 w-56 animate-pulse rounded-full bg-[#E2E8F0]" />
      <div className="mt-4 space-y-3">
        <div className="h-3 animate-pulse rounded-full bg-[#E2E8F0]" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#E2E8F0]" />
      </div>
    </div>
  );
}
