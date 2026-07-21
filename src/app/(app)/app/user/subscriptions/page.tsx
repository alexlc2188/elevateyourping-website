import React from "react";
import { UserPageWrapper } from "../_components/UserPageWrapper";
import { Header } from "../_components/Header";
import { AccountTabs } from "../_components/AccountTabs";

export default function MySubscriptionsPage() {
  return (
    <UserPageWrapper>
      <Header title="My subscriptions" />
      <AccountTabs />
      <div className="flex items-center justify-center ">
        You don't have any active subscriptions yet.
      </div>
    </UserPageWrapper>
  );
}
