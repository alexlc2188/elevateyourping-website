import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnlockMorePacksSection() {
  return (
    <div className="mt-16 bg-blue-50 py-10 px-4 sm:px-8 rounded-2xl text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl text-slate-900">
          Unlock More Training Packs for Free
        </h2>
        <p className="text-slate-700 max-w-xl mx-auto">
          Create your free account to access{" "}
          <span className="font-medium">Pendulum Serve Basics</span> and{" "}
          <span className="font-medium">Backspin Basics</span>. Continue your
          journey with essential skills.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ">
        {/* Backspin Basics */}
        <Link className="flex" href={"/auth/login"}>
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border cursor-pointer">
            <Image
              src="/images/packs/pendulum-serve-box.png"
              alt="Backspin Basics Pack"
              width={80}
              height={100}
              className="object-contain"
            />
            <div className="text-left space-y-1">
              <p className="text-base text-slate-900">Backspin Basics</p>
              <p className="text-sm text-slate-600">
                This pack focuses on forehand and backhand chop rallies,
                receiving backspin serves with precision, and even a
                stepping-in-and-out footwork.
              </p>
            </div>
          </div>
        </Link>

        {/* Serve Basics */}
        <Link className="flex" href={"/auth/login"}>
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border cursor-pointer">
            <Image
              src="/images/packs/backspin-serve-box.png"
              alt="Serve Basics Pack"
              width={80}
              height={100}
              className="object-contain"
            />
            <div className="text-left space-y-1">
              <p className="text-base text-slate-900">Pendulum Serve Basics</p>
              <p className="text-sm text-slate-600">
                This pack walks you through the fundamentals of generating
                topspin, sidespin.
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <Button asChild size={"lg"} className="text-lg  w-full sm:w-auto">
          <Link href="/auth/login" id="unlock-more-training-pack-button">
            Unlock More Free Training Packs
          </Link>
        </Button>
        <p className="text-sm text-slate-500 mt-1">
          Sign in with Google — it's fast and free.
        </p>
      </div>
    </div>
  );
}
