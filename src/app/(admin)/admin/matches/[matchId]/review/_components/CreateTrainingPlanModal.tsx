import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currentUser } from "@/lib/auth";
import { prismaDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const CreateTrainingPlanModal = async ({
  matchId,
}: {
  matchId: string;
}) => {
  const user = await currentUser();

  if (!user) redirect("/admin/matches");

  return (
    <div className="p-6">
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Training Plan</DialogTitle>
          </DialogHeader>
          <form
            action={async (formData) => {
              "use server";
              const title = formData.get("title")?.toString() || "";
              if (!title) return;
              try {
                const trainingPlan = await prismaDb.trainingPlan.create({
                  data: {
                    title,
                    match: {
                      connect: {
                        id: matchId,
                      },
                    },
                  },
                });

                await prismaDb.match.update({
                  where: {
                    id: matchId,
                  },
                  data: {
                    trainingPlanId: trainingPlan.id,
                  },
                });

          

                revalidatePath("/admin/matches");
              } catch (err) {
                console.error("Failed to create training plan:", err);
              }
            }}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Plan Title
                <input
                  name="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />
              </label>
              <button
                type="submit"
                className="mt-2 bg-primary text-white px-4 py-2 rounded-md cursor-pointer">
                Create Plan
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
