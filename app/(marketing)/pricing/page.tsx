import Image from "next/image";
import Link from "next/link";
import { SubscriptionPlan, UserSubscriptionPlan } from "@/types";
import { db } from "@/utils/supabase/db";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { ComparePlans } from "@/components/pricing/compare-plans";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";

export const metadata = constructMetadata({
  title: "Pricing – ASolutions",
  description: "Explore our subscription plans.",
});

export default async function PricingPage() {
  const user = await getCurrentUser();

  const plans = await db.query.plan.findMany();

  const pricingData: SubscriptionPlan[] = plans.map((plan) => ({
    title: plan.name,
    description: "For Beginners",
    prices: {
      monthly: Number(plan.monthlyPrice),
      yearly: Number(plan.yearlyPrice),
    },
    benefits: [
      "Up to 100 monthly posts",
      "Basic analytics and reporting",
      "Access to standard templates",
    ],
    limitations: [
      "No priority access to new features.",
      "Limited customer support",
      "No custom branding",
      "Limited access to business resources.",
    ],
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  }));
  if (user?.role === "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Seriously?</h1>
        <Image
          src="/_static/illustrations/call-waiting.svg"
          alt="403"
          width={560}
          height={560}
          className="pointer-events-none -my-20 dark:invert"
        />
        <p className="text-balance px-4 text-center text-2xl font-medium">
          You are an {user.role}. Back to{" "}
          <Link
            href="/admin"
            className="text-muted-foreground underline underline-offset-4 hover:text-purple-500"
          >
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  if (user && user.id) {
    // subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }
  const plan = plans[0];
  const subscriptionPlan: UserSubscriptionPlan = {
    title: plan.name,
    description: "For Beginners",
    prices: {
      monthly: Number(plan.monthlyPrice),
      yearly: Number(plan.yearlyPrice),
    },
    benefits: [
      "Up to 100 monthly posts",
      "Basic analytics and reporting",
      "Access to standard templates",
    ],
    limitations: [
      "No priority access to new features.",
      "Limited customer support",
      "No custom branding",
      "Limited access to business resources.",
    ],
    stripeIds: {
      monthly: null,
      yearly: null,
    },
    interval: "month",
    isPaid: true,
    stripeCurrentPeriodEnd: Date.now(),
    stripeCustomerId: "",
    stripeSubscriptionId: "",
    stripePriceId: "",
    isCanceled: false,
  };

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <PricingCards
        userId={user?.id}
        subscriptionPlan={subscriptionPlan}
        pricingData={pricingData}
      />
      <hr className="container" />
      <ComparePlans />
      <PricingFaq />
    </div>
  );
}
