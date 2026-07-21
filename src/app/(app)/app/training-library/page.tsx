"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrainingPackCard } from "./TrainingPackCard";
import { TrainingType } from "@prisma/client";
import { TrainingFilter } from "./TrainingFilter";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";

type TrainingTypeWithAll = TrainingType | "All";
type DifficultyWithAll = "Beginner" | "Intermediate" | "Advanced" | "All";

const trainingTypes: TrainingTypeWithAll[] = [
  TrainingType.technique,
  TrainingType.rally,
  TrainingType.serve,
  TrainingType.return,
  TrainingType.footwork,
  "All",
];

const difficultyLevels: DifficultyWithAll[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const packs = [
  {
    id: "1",
    title: "Forehand Fundamentals",
    type: TrainingType.rally,
    drills: 6,
    duration: "31 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869959_1280.jpg",
  },
  {
    id: "2",
    title: "Spin to Win",
    type: TrainingType.serve,
    drills: 7,
    duration: "39 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869957_1280.jpg",
  },
  {
    id: "3",
    title: "Backhand Blitz",
    type: TrainingType.serve,
    drills: 4,
    duration: "43 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869958_1280.jpg",
  },
  {
    id: "4",
    title: "Serve Like a Pro",
    type: TrainingType.footwork,
    drills: 4,
    duration: "33 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869960_1280.jpg",
  },
  {
    id: "5",
    title: "Footwork Frenzy",
    type: TrainingType.footwork,
    drills: 6,
    duration: "36 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869961_1280.jpg",
  },
  {
    id: "6",
    title: "Rally Control",
    type: TrainingType.technique,
    drills: 4,
    duration: "48 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869962_1280.jpg",
  },
  {
    id: "7",
    title: "Smash Training Camp",
    type: TrainingType.rally,
    drills: 8,
    duration: "28 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869963_1280.jpg",
  },
  {
    id: "8",
    title: "Looping Ladder",
    type: TrainingType.footwork,
    drills: 6,
    duration: "35 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869964_1280.jpg",
  },
  {
    id: "9",
    title: "Power Shots",
    type: TrainingType.serve,
    drills: 6,
    duration: "40 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869965_1280.jpg",
  },
  {
    id: "10",
    title: "Footwork Flow",
    type: TrainingType.rally,
    drills: 8,
    duration: "43 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869966_1280.jpg",
  },
];

export default function TrainingLibraryPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<TrainingTypeWithAll>("All");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyWithAll>("All");

  const filtered = packs.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" || p.type === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="bg-white min-h-screen text-white pb-20">
      {/* <div className="relative h-64 w-full overflow-hidden">
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
            size={"lg"}
            className="bg-primary mt-4 text-white hover:bg-red-700 text-base">
            Start Training
          </Button>
        </div>
      </div> */}
      <div className="ml-4">
        <AppBreadcrumb />
      </div>

      {/* Category Dropdown */}
      <TrainingFilter
        options={trainingTypes}
        value={selectedCategory}
        onChange={(val) => setSelectedCategory(val as TrainingTypeWithAll)}
      />

      {/* Difficulty Tabs */}
      <div className="flex justify-around px-4 bg-white py-3 border-b border-zinc-200">
        {difficultyLevels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`text-base font-medium relative pb-1 transition-all duration-200 ${
              selectedDifficulty === level
                ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-slate-500 hover:text-black"
            }`}>
            {level}
          </button>
        ))}
      </div>

      {/* Pack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 ">
        {filtered.map((pack, idx) => (
          <TrainingPackCard
            key={pack.id}
            pack={{
              ...pack,
              idx,
              difficulty: pack.difficulty as
                | "Beginner"
                | "Intermediate"
                | "Advanced",
            }}
          />
        ))}
      </div>
    </div>
  );
}
