export type BillingPlanKey = "patient-pro-monthly" | "patient-pro-yearly" | "clinic-starter" | "clinic-growth";

type BillingPlan = {
  key: BillingPlanKey;
  name: string;
  price: string;
  cadence: string;
  priceEnv: string;
  audience: "patient" | "clinic";
};

export const billingPlans: Record<BillingPlanKey, BillingPlan> = {
  "patient-pro-monthly": {
    key: "patient-pro-monthly",
    name: "Patient Pro",
    price: "$7.99",
    cadence: "per month",
    priceEnv: "STRIPE_PRICE_PATIENT_PRO_MONTHLY",
    audience: "patient",
  },
  "patient-pro-yearly": {
    key: "patient-pro-yearly",
    name: "Patient Pro Annual",
    price: "$59",
    cadence: "per year",
    priceEnv: "STRIPE_PRICE_PATIENT_PRO_YEARLY",
    audience: "patient",
  },
  "clinic-starter": {
    key: "clinic-starter",
    name: "Clinic Starter",
    price: "$149",
    cadence: "per month",
    priceEnv: "STRIPE_PRICE_CLINIC_STARTER_MONTHLY",
    audience: "clinic",
  },
  "clinic-growth": {
    key: "clinic-growth",
    name: "Clinic Growth",
    price: "$299",
    cadence: "per month",
    priceEnv: "STRIPE_PRICE_CLINIC_GROWTH_MONTHLY",
    audience: "clinic",
  },
};

export function getBillingPlan(planKey: string) {
  return billingPlans[planKey as BillingPlanKey] ?? null;
}

export function getPlanPriceId(planKey: BillingPlanKey) {
  const plan = billingPlans[planKey];
  const value = process.env[plan.priceEnv];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getAppUrl(origin?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  return origin?.replace(/\/$/, "") ?? "http://localhost:3000";
}
