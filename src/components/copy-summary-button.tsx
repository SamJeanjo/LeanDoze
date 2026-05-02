"use client";

import { useState } from "react";

export function CopySummaryButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copySummary() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copySummary}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 px-4 text-sm font-semibold text-[#0B1220] shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
    >
      {copied ? "Copied" : "Copy summary"}
    </button>
  );
}

