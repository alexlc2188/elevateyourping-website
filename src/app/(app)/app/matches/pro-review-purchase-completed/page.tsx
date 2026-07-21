// app/success/page.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl text-secondary mb-4">
        Purchase Confirmed – Let’s Elevate Your Game
      </h1>
      <p className="text-slate-600 mb-6">
        Your match review is on its way 🏓 <br />
        Sit tight – we'll notify you once it's ready!
      </p>
      <Link href="/app">
        <Button size={"lg"}>Go to Dashboard</Button>
      </Link>
    </main>
  );
}
