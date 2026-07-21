import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Match Review",
        slug: "match-review",
        description:
          "Coach-reviewed highlights and personalized feedback on your uploaded match.",
        stripePriceId: "price_1ReVU2QPejG2wRiWQxpNI8Br",
        amount: 9900,
        currency: "aud",
        category: "MATCH",
        matchOffer: "REVIEW_ONLY",
        limitedTimeOffer: true,
        weeklyLimit: 10,
        weeklySoldCount: 0,
      },
      {
        name: "Training Plan",
        description:
          "A personalized training plan based on your match analysis, including videos and a workout companion.",
        slug: "training-plan",
        stripePriceId: "price_1ReVUsQPejG2wRiW3Tq8WpT4",
        amount: 9900,
        currency: "aud",
        category: "MATCH",
        matchOffer: "PLAN_ONLY",
        limitedTimeOffer: false,
      },
      {
        name: "Full Training Bundle",
        description:
          "Get everything: match review, highlights, and a personalized training plan with videos and tools.",
        slug: "full-training-bundle",
        stripePriceId: "price_1ReVVZQPejG2wRiWetk9kkkG",
        amount: 12900,
        currency: "aud",
        category: "MATCH",
        matchOffer: "REVIEW_AND_PLAN",
        highlightText: "Save 30%",
        highlightColor: "green",
        limitedTimeOffer: true,
        weeklyLimit: 10,
        weeklySoldCount: 0,
      },
    ],
  });

  console.log("✅ Products seeded.");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
