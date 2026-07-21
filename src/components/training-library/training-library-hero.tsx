import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
export const TrainingLibraryHero = () => {
  return (
    <div className="relative h-64 w-full overflow-hidden">
      <Image
        src="/images/hero-admin.jpg"
        alt="Hero"
        fill
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
        <h1 className="text-4xl font-black">MASTER YOUR GAME</h1>
        <p className="text-lg text-white/80 mt-2">
          Explore world-class table tennis training packs
        </p>
        <Button
          asChild
          size={"lg"}
          className="bg-primary mt-4 text-white hover:bg-red-700 text-base">
          <Link href={"/app/training"}>Start Training</Link>
        </Button>
      </div>
    </div>
  );
};
