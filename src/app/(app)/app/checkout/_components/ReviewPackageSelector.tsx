import { Product, MatchOffer } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReviewPackageSelectorProps {
  products: Product[];
  selected: MatchOffer;
  onSelect: (offer: MatchOffer) => void;
}

export function ReviewPackageSelector({
  products,
  selected,
  onSelect,
}: ReviewPackageSelectorProps) {
  const matchReview = products.find((p) => p.matchOffer === "REVIEW_ONLY");
  const fullBundle = products.find((p) => p.matchOffer === "REVIEW_AND_PLAN");

  return (
    <div className="space-y-4">
      <h3 className="text-xl mb-3">Choose Your Review Package</h3>
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Review Only Card */}
        {matchReview && (
          <div
            onClick={() => onSelect("REVIEW_ONLY")}
            className={cn(
              "flex-1 cursor-pointer border rounded-xl p-4 transition hover:shadow-md",
              selected === "REVIEW_ONLY"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-medium">
                {matchReview.name}
              </Label>
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                Most Popular
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {matchReview.description}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-lg font-semibold text-slate-700">
                AUD${(matchReview.amount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        {/* Bundle Card */}
        {fullBundle && (
          <div
            onClick={() => onSelect("REVIEW_AND_PLAN")}
            className={cn(
              "flex-1 cursor-pointer border rounded-xl p-4 transition hover:shadow-md",
              selected === "REVIEW_AND_PLAN"
                ? "border-green-500 bg-green-50"
                : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-medium">{fullBundle.name}</Label>
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">
                Save 30%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {fullBundle.description}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-lg font-semibold text-green-700">
                AUD${(fullBundle.amount / 100).toFixed(2)}
              </p>
            </div>
            {matchReview && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className="line-through mr-2 text-slate-400">
                  Regular: AUD${((matchReview.amount + 9900) / 100).toFixed(2)}
                </span>
                <span className="text-green-700 font-semibold">
                  You save AUD$
                  {(
                    (matchReview.amount + 9900 - fullBundle.amount) /
                    100
                  ).toFixed(2)}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
