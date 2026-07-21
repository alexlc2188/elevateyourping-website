import { getAllTags } from "@/lib/services/tags";
import { PageHeader } from "../_components/page-header";
import { ExerciseForm } from "../_components/exercise-form";

export default async function CreateExercisePage() {
  const tagResponse = await getAllTags();
  const tags = tagResponse ?? [];

  return (
    <div className="py-8 px-4">
      <PageHeader
        title="Create New Exercise"
        showBackButton={false}
        showNewButton={false}
      />
      <ExerciseForm availableTags={tags} isNew={true} />
    </div>
  );
}
