"use client";
import React, { useEffect, useState } from "react";
import { MatchWithPayload } from "../page";
import { Product } from "@prisma/client";
import { toast } from "sonner";
import { PromoTag } from "@/components/tag/promo-tag";

interface Props {
  match: MatchWithPayload;
}

export const PurchaseOfferScreen = ({ match }: Props) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) return; // Already loaded

    const getProducts = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/products/match");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const fetchedProducts = (await res.json()) as Product[];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("❌ Error loading products:", error);
        toast.error("Failed to load product info");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const matchReviewOffer = products.find((p) => p.matchOffer === "REVIEW_ONLY");
  const bundleOffer = products.find((p) => p.matchOffer === "REVIEW_AND_PLAN");

  if (loading || !products) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading upgrade offer...
      </div>
    );
  }

  //   if (!matchReviewOffer || !bundleOffer) {
  //     return (
  //       <div className="text-sm text-muted-foreground mt-6 text-center">
  //         No upgrade offers available at the moment.
  //       </div>
  //     );
  //   }

  return (
    <div className="mt-8 pt-6 border-t">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
          ✨ LIMITED TIME OFFER
        </div>
        <h3 className="text-xl text-slate-900 mb-2">
          Get Expert Feedback on This Match
        </h3>
        <p className="text-slate-600 mb-4 max-w-2xl mx-auto">
          Take your game to the next level with a professional review or
          training bundle.
        </p>

        <div className="grid gap-4 max-w-2xl mx-auto grid-cols-1 md:grid-cols-2">
          {/* Basic Review */}
          {matchReviewOffer && (
            <div className="border rounded-xl p-5 hover:shadow-md transition-all bg-white">
              <div className="flex flex-col items-center text-center">
                <h4 className="text-lg text-slate-900 mb-1">
                  {matchReviewOffer.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {matchReviewOffer.description}
                </p>
                <div className="w-full mb-3">
                  <div className="text-2xl font-bold text-slate-900">
                    ${(matchReviewOffer.amount / 100).toFixed(0)}
                  </div>
                  {/* <p className="text-xs text-green-600 mt-1">
                    Only {matchReviewOffer.weeklyLimit} left this week
                  </p> */}
                  {matchReviewOffer.limitedTimeOffer &&
                    matchReviewOffer.weeklyLimit != null && (
                      <PromoTag
                        color="red"
                        text={
                          matchReviewOffer.weeklySoldCount >=
                          matchReviewOffer.weeklyLimit
                            ? "Offer Full This Week"
                            : `Only ${
                                matchReviewOffer.weeklyLimit -
                                matchReviewOffer.weeklySoldCount
                              } left this week`
                        }
                      />
                    )}
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `/app/checkout?matchId=${match.id}&selectedProductUpsell=${matchReviewOffer.matchOffer}`)
                  }
                  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Get Match Review
                </button>
              </div>
            </div>
          )}

          {/* Full Training Bundle */}
          {bundleOffer && (
            <div className="border-2 border-blue-200 rounded-xl p-5 hover:shadow-md transition-all bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 transform translate-x-2 translate-y-2 rotate-12">
                BEST VALUE
              </div>
              <div className="flex flex-col items-center text-center">
                <h4 className="text-lg text-slate-900 mb-1">
                  {bundleOffer.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {bundleOffer.description}
                </p>
                <div className="w-full mb-3">
                  <span className="text-xs text-slate-500 line-through">
                    $198
                  </span>
                  <div className="text-2xl font-bold text-slate-900">
                    ${(bundleOffer.amount / 100).toFixed(0)}
                  </div>
                  <PromoTag
                    color="green"
                    text={`Save $${198 - bundleOffer.amount / 100}`}
                  />
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `/app/checkout?matchId=${match.id}&selectedProductUpsell=${bundleOffer.matchOffer}`)
                  }
                  className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all">
                  Get Training Bundle
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-4">
          Offers are valid for a limited time only. Get your discount now.
        </p>
      </div>
    </div>
  );
};
