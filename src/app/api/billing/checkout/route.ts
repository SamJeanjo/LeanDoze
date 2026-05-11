import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthIdentity } from "@/lib/auth-identity";
import { getAppUrl, getBillingPlan, getPlanPriceId } from "@/lib/billing";

export async function POST(request: Request) {
  const identity = await getAuthIdentity();

  if (!identity) {
    return NextResponse.json({ success: false, message: "Sign in to upgrade your LeanDoze plan." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = getBillingPlan(String(body.plan ?? ""));

  if (!plan) {
    return NextResponse.json({ success: false, message: "Choose a valid LeanDoze plan." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = getPlanPriceId(plan.key);

  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        success: false,
        message: `Stripe checkout is not configured yet. Add STRIPE_SECRET_KEY and ${plan.priceEnv} in Vercel.`,
      },
      { status: 503 },
    );
  }

  const origin = request.headers.get("origin") ?? undefined;
  const appUrl = getAppUrl(origin);
  const stripe = new Stripe(secretKey, { typescript: true });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: identity.email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId: identity.userId,
      plan: plan.key,
      audience: plan.audience,
    },
    success_url: `${appUrl}/${plan.audience === "clinic" ? "clinic/settings" : "app/reports"}?checkout=success&plan=${plan.key}`,
    cancel_url: `${appUrl}/${plan.audience === "clinic" ? "clinic/reports" : "app/reports"}?checkout=cancelled&plan=${plan.key}`,
  });

  return NextResponse.json({ success: true, url: session.url });
}
