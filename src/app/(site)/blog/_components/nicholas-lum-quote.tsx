import Image from "next/image";

export const NicholasLumQuote = () => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center justify-center  text-left max-w-3xl mx-auto">
      <Image
        src="/images/pro-players/nicholas-lum-rounded.png" // Use non-rounded image
        alt="Nicholas Lum"
        height={100}
        width={100}
      />

      <div className="text-slate-700 ">
        <p className="italic text-base">
          “Alex is not just a skilled player but also a fantastic coach with
          years of experience competing at the highest international levels. His
          deep understanding of the game — from advanced strategy to fine-tuning
          technique — makes him an invaluable teacher.”
        </p>
        <div className="mt-2 font-semibold text-slate-900">— Nicholas Lum</div>
        <div className="text-slate-500 text-sm">
          Australian National Team • WR #41
        </div>
      </div>
    </div>
  );
};
