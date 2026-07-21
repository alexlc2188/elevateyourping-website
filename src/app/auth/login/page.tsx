import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInGoogleButton } from "../_components/signInGoogleButton";
import { InAppBrowserModal } from "@/components/auth/in-app-browser-modal";

export const metadata = {
  title: "Login | Elevate Your Ping Table Tennis App",
  description:
    "Log in to your Elevate Your Ping account to access your training history, match reviews, personalized drills, and more.",
  openGraph: {
    title: "Login | Elevate Your Ping Table Tennis App",
    description:
      "Log in to your Elevate Your Ping account to access your training history, match reviews, personalized drills, and more.",
    url: "https://www.elevateyourping.com/auth/login",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://www.elevateyourping.com/images/home/elevate-tool.png",
        width: 800,
        height: 1000,
        alt: "Elevate Your Ping Login",
      },
    ],
    type: "website",
  },
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <>
      <div className="h-full flex flex-col lg:grid lg:grid-cols-2">
        {/* Hero Section for Desktop */}
        <div className="relative hidden lg:block">
          <Image
            src="/images/pro-players/nicholas-lum-1.jpg"
            alt="Table tennis rally"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
          <div className="absolute inset-0 flex flex-col justify-center px-24 text-white">
            <h1 className="text-5xl  leading-tight">
              Train Smarter.
              <br />
              One Drill At The Time.
            </h1>
            <p className="mt-4 text-xl max-w-md text-slate-200">
              Train smarter with step-by-step drills, free and premium training
              packs — or upload your match for expert coaching.
            </p>
            <ul className="mt-6 space-y-2 text-lg">
              <li>✅ Already helping players level up their game</li>
              <li>🛡 Trusted by professional-level players</li>
              <li>⭐ Built for serious club players</li>
            </ul>
            <p className="mt-6 font-semibold text-lg">
              Unlock access to packs like:
            </p>
            <ul className="mt-2 space-y-1 text-lg text-slate-200">
              <li>🏓 Forehand Loop Basics</li>
              <li>🔄 Backspin Rally Builder</li>
              <li>🚀 3rd Ball Attack Strategy</li>
            </ul>
          </div>
        </div>

        {/* Login + Mobile Hero */}
        <div className="flex flex-col justify-center items-center px-6 py-10 w-full">
          <div className="w-full max-w-md">
            {/* <Image
              src="/logos/full-logo.png"
              alt="Elevate Your Ping"
              width={120}
              height={120}
              className="mx-auto mb-6 hidden lg:block"
            /> */}

            {/* <h2 className="text-4xl  text-center">Let’s Elevate Your Ping</h2>
            <p className="text-center mt-2 text-slate-600">
              Sign in to unlock 3 free training packs instantly.
            </p>

            <div className="mt-6 text-center">
              <SignInGoogleButton />
              <p className="mt-2 text-sm text-slate-400">
                ✅ No payment required · Just sign in with Google
              </p>
            </div> */}

            <h2 className="text-4xl text-center">
              LET’S ELEVATE YOUR PING
            </h2>
            <p className="text-center text-slate-500 mt-2">
              Sign in to unlock 3 free training packs instantly.
            </p>

            <div className="mt-8 mb-4">
              <SignInGoogleButton />
            </div>

            <p className="text-center text-sm text-green-700">
              ✅ No payment required · Just sign in with Google
            </p>

            {/* Mobile Hero Block */}
            <div className="mt-10 rounded-xl overflow-hidden lg:hidden">
              <div className="relative bg-[url('/images/pro-players/nicholas-lum-1.jpg')] bg-cover bg-center text-white">
                <div className="absolute inset-0 bg-black/70" />
                <div className="relative px-6 py-12 text-center z-10">
                  <h1 className="text-3xl  leading-tight">
                    Train Smarter.
                    <br />
                    One Drill At The Time.
                  </h1>
                  <p className="mt-4 text-base">
                    Train smarter with step-by-step drills, free and premium
                    training packs — or upload your match for expert coaching.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm">
                    <li>✅ Already helping players level up their game</li>
                    <li>🛡 Trusted by professional-level players</li>
                    <li>⭐ Built for serious club players</li>
                  </ul>
                  <p className="mt-6 font-semibold text-sm">
                    Unlock access to packs like:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>🏓 Forehand Loop Basics</li>
                    <li>🔄 Backspin Rally Builder</li>
                    <li>🚀 3rd Ball Attack Strategy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-10 bg-slate-50 rounded-xl p-6 space-y-6 shadow ring-1 ring-slate-100">
              <h3 className="text-xl text-slate-700 text-center uppercase tracking-wide">
                What players are saying
              </h3>
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/pro-players/daniel-rounded.png"
                  alt="Daniel"
                  width={40}
                  height={40}
                  className="rounded-full mt-1"
                />
                <div>
                  <p className="font-medium text-sm text-slate-900">Daniel</p>
                  <p className="text-xs text-slate-500">
                    Sydney Table Tennis Player
                  </p>
                  <p className="italic text-xs mt-1 text-slate-700">
                    “The feedback was a game changer. I’m finally beating the
                    players I used to lose to.”
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-200" />
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/pro-players/nicholas-lum-rounded.png"
                  alt="Nicholas Lum"
                  width={40}
                  height={40}
                  className="rounded-full mt-1"
                />
                <div>
                  <p className="font-medium text-sm text-slate-900">
                    Nicholas Lum
                  </p>
                  <p className="text-xs text-slate-500">
                    Australian National Team · WR #41
                  </p>
                  <p className="italic text-xs mt-1 text-slate-700">
                    “Alex is not just a skilled player but also a fantastic
                    coach with years of experience competing at the highest
                    international levels… makes him an invaluable teacher.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InAppBrowserModal />
    </>
  );
}
