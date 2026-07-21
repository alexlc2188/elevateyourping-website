import React from "react";
import { UserPageWrapper } from "../_components/UserPageWrapper";
import { Header } from "../_components/Header";
import { OrderTable } from "./_components/ordersTable";
import { Columns } from "./_components/ordersColumn";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prismaDb } from "@/lib/db";
import { AccountTabs } from "../_components/AccountTabs";

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  const purchases = await prismaDb.purchase.findMany({
    where: {
      userId: user.id,
    },
    include: {
      match: {
        select: {
          opponentName: true,
        },
      },
    },
  });

  return (
    <UserPageWrapper>
      <Header title="Invoices" />
      <AccountTabs />
      <OrderTable data={purchases} columns={Columns} />
    </UserPageWrapper>
  );
}
