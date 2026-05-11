"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { BillingPlanKey } from "@/lib/billing";

type CheckoutButtonProps = {
  plan: BillingPlanKey;
  children: ReactNode;
  className?: string;
};

export function CheckoutButton({ plan, children, className = "" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = (await response.json()) as { success?: boolean; url?: string; message?: string };

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message ?? "Checkout could not be started.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button type="button" onClick={startCheckout} disabled={loading} className={className} aria-busy={loading}>
        {loading ? "Opening checkout..." : children}
      </button>
      {error ? <p className="text-xs leading-5 text-[#B45309]">{error}</p> : null}
    </div>
  );
}
