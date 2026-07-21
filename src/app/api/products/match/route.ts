// app/api/products/match/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { category: "MATCH", active: true },
      orderBy: { amount: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[GET_MATCH_PRODUCTS]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
