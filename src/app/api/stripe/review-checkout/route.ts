// app/api/stripe/checkout/route.ts
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.amount || !body.productName || !body.matchId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment", // or 'subscription'
      payment_method_types: ["card"],
      customer_email: session.user.email, // 👈 PREFILL EMAIL
      allow_promotion_codes: true,

      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: body.amount, // in cents (e.g., 999 = $9.99)
            product_data: {
              name: body.productName,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/matches/${
        body.matchId
      }/thank-you?value=${body.amount}&product_name=${encodeURIComponent(
        body.productName,
      )}&item_id=${encodeURIComponent(body.matchOffer)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/checkout?matchId=${body.matchId}`,

      // ✅ Attach matchId and matchOffer to metadata
      metadata: {
        matchId: body.matchId,
        userId: session.user.id,
        matchOffer: body.matchOffer || "REVIEW_ONLY", // Default to REVIEW_ONLY if not specified
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[STRIPE_ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
