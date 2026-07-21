import Link from "next/link";
import { TrackPurchaseComplete } from "./_components/TrackPurchaseComplete";

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams?: Promise<{
    value?: number;
    product_name?: string;
    item_id?: string;
  }>;
}) {
  const { matchId } = await params;

  const searchParamsPromise = await searchParams;

  const value = searchParamsPromise?.value ?? 69;
  const productName = searchParamsPromise?.product_name ?? "Unknown";
  const itemId = searchParamsPromise?.item_id ?? "match-review";

  return (
    <>
      <TrackPurchaseComplete
        matchId={matchId}
        value={value}
        productName={productName}
        itemId={itemId}
      />
      <main className="h-full flex flex-col items-center justify-center text-center px-4 py-20 space-y-10">
        <h1 className="text-4xl  text-green-600 mb-4">
          🎉 Thank You for Your Purchase!
        </h1>
        <p className="text-lg text-zinc-700 mb-6 max-w-xl">
          Your match has been successfully submitted for review. A coach will
          get started shortly — you’ll be notified when your review is ready.
        </p>

        <Link
          href={`/app/matches/${matchId}`}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-md text-lg hover:bg-red-700 transition">
          View Your Match
        </Link>

        <p className="text-sm text-zinc-500">
          You can check the status anytime from your dashboard.
        </p>
      </main>
    </>
  );
}
