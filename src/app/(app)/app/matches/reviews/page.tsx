import { currentUser } from "@/lib/auth";
import React from "react";
import MyMatchesPage from "./MyMatchesPage";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { getUserFullMatches } from "@/lib/services/matches";

const MatchesPage = async () => {
  const user = await currentUser();
  const { success, data } = await getUserFullMatches(user!.id);

  return (
    <div className="p-4">
      <AppBreadcrumb />
      {!success && <p className="text-red-500">Failed to load matches.</p>}
      {data.length === 0 && success && (
        <p className="text-muted-foreground text-sm">No matches found.</p>
      )}
      <MyMatchesPage matches={data} />
    </div>
  );
};

export default MatchesPage;
