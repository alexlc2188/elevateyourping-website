// app/cancel/page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex h-full flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl  text-secondary mb-4">Checkout Cancelled</h1>
      <p className="text-slate-600 mb-6">
        You’ve been redirected back from the payment page. No charges were made.
        You can manage your account or try again anytime from your dashboard.
      </p>
      <Button size={"lg"} asChild>
        <Link href="/app">Go to Dashboard</Link>
      </Button>
    </main>
  );
}
