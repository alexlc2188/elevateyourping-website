import { Banner } from "@/components/banner";
import React from "react";
import { PageHeaderGeneric } from "../_components/page-header-generic";
import { TrainingPackDataTableClient } from "./_components/training-pack-data-table";
import { prismaDb } from "@/lib/db";
import { BackButton } from "@/components/back-button";
import {
  getTrainingPacksAction,
  getTrainingPacksActionAdmin,
} from "@/actions/admin/trainingPacksActions";

const TrainingPackPage = async () => {
  const getTotalCount = () => prismaDb.trainingPack.count();

  const [trainingPackResponse, numberOfPackInCollection] = await Promise.all([
    getTrainingPacksActionAdmin(),
    getTotalCount(),
  ]);

  const { data: packs, success, error } = trainingPackResponse;

  return (
    <div className="py-6">
      <BackButton />
      <PageHeaderGeneric
        header="All Training Packs"
        actionButton={{
          href: "/admin/training-packs/create",
          label: "Create",
        }}
      />

      {!success ? (
        <Banner
          variant="error"
          label={error || "Failed to load training packs"}
        />
      ) : (
        <TrainingPackDataTableClient
          data={packs ?? []}
          total={numberOfPackInCollection ?? 0}
        />
      )}
    </div>
  );
};

export default TrainingPackPage;
