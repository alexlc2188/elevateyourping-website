import { prismaDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🔥 Webhook received");

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const rawBody = await req.text(); // Stripe sends raw string, not JSON

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ✅ Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const matchId = session?.metadata?.matchId;
    const matchOffer = session?.metadata?.matchOffer;
    const userId = session.metadata?.userId;
    const email = session.customer_email;
    const amount = session.amount_total;
    const stripeSessionId = session.id;

    if (!matchId) {
      console.error("❌ matchId is missing in session metadata");
      return NextResponse.json({ error: "Missing matchId" }, { status: 400 });
    }

    console.log(
      "✅ Payment confirmed for",
      email,
      amount,
      "Package:",
      matchOffer,
      "Session:",
      stripeSessionId,
    );

    try {
      await prismaDb.match.update({
        where: { id: matchId },
        data: {
          paymentStatus: "PURCHASED",
          // Update the offerType based on what the user actually purchased
          offerType:
            (matchOffer as "REVIEW_ONLY" | "REVIEW_AND_PLAN") || "REVIEW_ONLY",
          // Save the Stripe session ID for tracking and potential refunds
          stripeSessionId: stripeSessionId,
        },
      });

      console.log(
        `✅ Match ${matchId} updated: payment confirmed for ${email}, package: ${matchOffer}, session: ${stripeSessionId}`,
      );

      await prismaDb.purchase.create({
        data: {
          type: "MATCH_REVIEW",
          stripeSessionId,
          stripePaymentIntentId: session.payment_intent as string,
          // productSlug: matchOffer - i took it out as i m not sure what to do with it.
          priceCents: session.amount_total ?? 0,
          currency: session.currency?.toUpperCase() ?? "AUD",
          match: {
            connect: {
              id: matchId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (err) {
      console.error("❌ Failed to update match", err);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    // You'd typically:
    // - Look up the user by email
    // - Mark their match or product as unlocked in the DB
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const matchId = invoice.metadata?.matchId;

    if (matchId) {
      try {
        await prismaDb.match.update({
          where: { id: matchId },
          data: { paymentStatus: "FAILED" },
        });
      } catch (error) {
        console.error("❌ Failed to update match", error);
        return NextResponse.json(
          { error: "DB update failed" },
          { status: 500 },
        );
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const matchId = session.metadata?.matchId;

    if (matchId) {
      try {
        await prismaDb.match.update({
          where: { id: matchId },
          data: { paymentStatus: "CANCELLED" },
        });
      } catch (error) {
        console.error("❌ Failed to update match", error);
        return NextResponse.json(
          { error: "DB update failed" },
          { status: 500 },
        );
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const matchId = charge.metadata?.matchId;

    if (matchId) {
      try {
        await prismaDb.match.update({
          where: { id: matchId },
          data: { paymentStatus: "REFUNDED" },
        });
      } catch (error) {
        console.error("❌ Failed to update match", error);
        return NextResponse.json(
          { error: "DB update failed" },
          { status: 500 },
        );
      }
    }
  }

  console.log("AT THE END. ");

  return NextResponse.json({ received: true }, { status: 200 });
}
