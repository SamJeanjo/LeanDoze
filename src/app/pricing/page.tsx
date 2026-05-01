import { PricingCard } from "@/components/cards";
import { DashboardShell, Footer } from "@/components/layout";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <div>
      <DashboardShell
        eyebrow="Pricing"
        title="Simple plans for GLP-1 support."
        description="Stripe-ready pricing tiers for individual patients and clinic programs, with mock checkout actions in this demo."
      >
        <div className="grid gap-5 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
        <div className="mt-8 rounded-[1.5rem] border border-teal-200 bg-teal-50 p-6 text-sm leading-6 text-slate-700">
          Payments are structured for Stripe integration. Production checkout should validate plan IDs server-side and never trust client-provided prices.
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
