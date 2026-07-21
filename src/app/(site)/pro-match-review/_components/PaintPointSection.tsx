import Image from "next/image";
import { AlertTriangle, Flame, User } from "lucide-react";

export function PainPointsSection() {
  return (
    <section className="bg-slate-50 py-12 px-4 md:px-8 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl text-slate-900 mb-6 leading-tight">
            Why You're Not Improving — Yet
          </h2>
          <p className="text-slate-600 text-base lg:text-lg mb-8 max-w-lg">
            Most table tennis players struggle to get better because they lack
            the right feedback or focus in their training.
          </p>

          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="bg-red-100 text-red-600 w-12 h-12 flex items-center justify-center rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-slate-800">
                <strong className="font-semibold">
                  You’re practicing the wrong things.
                </strong>{" "}
                Without specific feedback, your reps build bad habits.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-red-100 text-red-600 w-12 h-12 flex items-center justify-center rounded-full">
                <User className="w-6 h-6" />
              </div>
              <p className="text-slate-800">
                <strong className="font-semibold">
                  You’re stuck repeating bad habits.
                </strong>{" "}
                Most players don’t realize they’re reinforcing the same
                mistakes.
              </p>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-red-100 text-red-600 w-12 h-12 flex items-center justify-center rounded-full">
                <Flame className="w-6 h-6" />
              </div>
              <p className="text-slate-800">
                <strong className="font-semibold">
                  You rely on random advice from friends or YouTube.
                </strong>{" "}
                But generic tips rarely fix your specific problems.
              </p>
            </li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="relative md:pl-8 hidden md:flex items-end justify-end">
          <Image
            src="/images/pro-match-review/pain-player.png"
            alt="Frustrated table tennis player"
            width={500}
            height={600}
            className="object-contain -mb-12"
            priority
          />
        </div>
      </div>
    </section>
  );
}
