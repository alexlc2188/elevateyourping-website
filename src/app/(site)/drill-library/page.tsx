import { getTrainingPacksAction } from "@/actions/admin/trainingPacksActions";
import { TrainingLibrary } from "@/components/training-library/training-library";
import { notFound } from "next/navigation";
import React from "react";
import { HeaderSection } from "../_components/HeaderSection";

export const metadata = {
  title: "Drill Library | Learn Table Tennis Step by Step",
  description:
    "Build your skills with easy-to-follow training packs. Learn top spin, footwork, serves, and more — all designed to help you play better in real matches.",
  openGraph: {
    title: "Drill Library | Learn Table Tennis Step by Step",
    description:
      "Build your skills with easy-to-follow training packs. Learn top spin, footwork, serves, and more — all designed to help you play better in real matches.",
    url: "https://www.elevateyourping.com/drill-library",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://www.elevateyourping.com/images/home/hero-laptop-sm.png",
        width: 1200,
        height: 630,
        alt: "Table Tennis Drill Library by Elevate Your Ping",
      },
    ],
    type: "website",
  },
};

const ElevateLibraryPage = async () => {
  const { data, success, error } = await getTrainingPacksAction();

  if (error || !success) {
    return notFound();
  }

  if (!data || data.length === 0)
    return (
      <div className="h-full flex items-center justify-center">
        <p>The drill library is empty</p>
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto py-16  pt-12 ">
      <HeaderSection subHeader="Build your skills with easy-to-follow training packs. Each pack focuses on one thing — like technique, footwork, or serving — so you know exactly what to work on. Learn faster with step-by-step videos from a top coach.">
        <h1 className="text-4xl lg:text-5xl text-slate-900">
          Explore the <span className="text-red-600">Drill Library</span>
        </h1>
      </HeaderSection>
      <div className="mt-12">
        <TrainingLibrary trainingPacks={data} trainingPackUserSelected={null} />
      </div>
    </div>
  );
};

export default ElevateLibraryPage;
