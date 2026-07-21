import { getAllTrainingPlansAction } from "@/actions/admin/trainingPlansActions";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";


const TrainingPlans = async () => {
  const { data, success } = await getAllTrainingPlansAction();

  const plans = data ?? [];

  return (
    <main className="py-10 space-y-10">
      <BackButton />

      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Training Plans</h1>

        {!success && (
          <p className="text-red-500">Failed to load training plans.</p>
        )}

        {plans.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No training plans yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="border rounded-md p-4 flex items-center justify-between shadow-sm hover:bg-muted/50 transition">
                <div>
                  <h3 className="font-semibold text-lg">{plan.title}</h3>
                </div>
                <Link href={`/admin/training-plans/${plan.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default TrainingPlans;
