// /app/api/purchase/receipt/route.ts
import { stripe } from "@/lib/stripe";
import { prismaDb } from "@/lib/db";
import { currentUser } from "@/lib/auth"; // or however you get current user
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { stripePaymentIntentId } = await req.json();

    const user = await currentUser(); // use your own auth mechanism

    if (!stripePaymentIntentId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ownership
    const purchase = await prismaDb.purchase.findUnique({
      where: { stripePaymentIntentId },
      select: { userId: true },
    });

    if (!purchase || purchase.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Retrieve the charge directly
    const paymentIntent = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
    );

    const latestChargeId = paymentIntent.latest_charge;

    if (!latestChargeId) {
      return NextResponse.json({ error: "No charge yet" }, { status: 404 });
    }

    const charge = await stripe.charges.retrieve(latestChargeId.toString());
    const receiptUrl = charge.receipt_url;

    if (!receiptUrl) {
      return NextResponse.json(
        { error: "Receipt URL not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ receiptUrl });
  } catch (err) {
    console.error("[RECEIPT_FETCH_ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
