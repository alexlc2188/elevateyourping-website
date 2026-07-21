import React from "react";
import { ReviewsList } from "../../matches/_components/views/ReviewsList";
import { AccountTabs } from "../_components/AccountTabs";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prismaDb } from "@/lib/db";
import { UserPageWrapper } from "../_components/UserPageWrapper";
import { Header } from "../_components/Header";

export default async function UserReviewsPage() {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  const matches = await prismaDb.match.findMany({
    where: {
      userId: user.id,
      offerType: {
        not: "LOG",
      },
      isPublished: true,
      paymentStatus: "PURCHASED",
    },
    select: {
      eventName: true,
      id: true,
      isPublished: true,
      logNote: true,
      matchDate: true,
      opponentName: true,
      finalScore: true,
      offerType: true,
    },
  });

  return (
    <UserPageWrapper>
      <Header title="My match reviews" />
      <AccountTabs />
      <ReviewsList matches={matches} />
    </UserPageWrapper>
  );
}
