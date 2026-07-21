import { getTrainingPacksAction } from "@/actions/admin/trainingPacksActions";
import { TrainingLibrary } from "@/components/training-library/training-library";
import { currentUser } from "@/lib/auth";
import { prismaDb } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default async function LibraryPage() {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  // const trainingPacksUserSelected =
  //   await prismaDb.userTrainingPackSelection.findMany({
  //     where: {
  //       userId: user.id,
  //     },
  //     select: {
  //       trainingPackId: true,
  //     },
  //   });

  const latestPackSelected = await prismaDb.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      selectedTrainingPackId: true,
    },
  });

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
    <TrainingLibrary
      trainingPacks={data}
      trainingPackUserSelected={
        latestPackSelected?.selectedTrainingPackId ?? null
      }
    />
  );
}
