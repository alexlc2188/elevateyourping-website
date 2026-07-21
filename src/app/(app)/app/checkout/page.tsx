import { getMatchById } from "@/lib/services/matches";
import { redirect } from "next/navigation";
import ReviewPurchasePage from "./_components/ReviewPurchasePage";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { currentUser } from "@/lib/auth";
import { prismaDb } from "@/lib/db";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ matchId: string; selectedProductUpsell?: string }>;
}) {
  const { matchId, selectedProductUpsell } = await searchParams;
  const user = await currentUser();

  if (!user) redirect("/auth/login");
  if (!matchId) redirect("/app/matches");

  const {
    data: match,
    error,
    success,
  } = await getMatchById({
    matchId,
    userId: user.id,
  });

  if (!success || !match) {
    redirect("/app/matches");
  }

  const products = await prismaDb.product.findMany({
    where: {
      category: "MATCH",
    },
  });

  if (!products) {
    console.error("No products found");
    redirect("/app/matches");
  }

  const selectedProduct = products.find(
    (p) => p.matchOffer === match.offerType
  );

  const selectedProductFromUpsellPage = products.find(
    (p) => p.matchOffer === selectedProductUpsell
  );

  if (!selectedProduct && !selectedProductFromUpsellPage) {
    console.error("No product found for offer type", match.offerType);
    redirect("/app/matches");
  }

  const productSelected = selectedProduct || selectedProductFromUpsellPage;

  return (
    <div className="px-4 space-y-4 lg:max-w-2xl lg:mx-auto">
      <AppBreadcrumb />
      <ReviewPurchasePage
        match={match}
        products={products}
        selectedProduct={productSelected!}
      />
    </div>
  );
}
