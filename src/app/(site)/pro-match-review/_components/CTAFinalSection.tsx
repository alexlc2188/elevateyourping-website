import Link from "next/link";

export function CTAFinalSection() {
  return (
    <section className="bg-primary text-white py-20 px-4 md:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl mb-4">
          Ready to Elevate Your Game?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Stop guessing. Get expert feedback, pro-level breakdowns, and a
          training plan tailored to your footage.
        </p>

        <div className="mt-4 flex justify-center">
          <Link
            href="/auth/login"
            className="bg-white font-semibold text-lg text-primary px-6 py-3 rounded-lg shadow hover:bg-zinc-100 transition">
            Start Your Match Review
          </Link>
        </div>

        <p className="text-sm text-red-100 italic mt-6 max-w-sm mx-auto leading-snug">
          You'll need to log in to save your match, receive coach feedback, and
          track your training plan.
        </p>
      </div>
    </section>
  );
}
