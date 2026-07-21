import { getExerciseById } from "@/lib/services/exercises";
import { getAllTags } from "@/lib/services/tags";
import { PageHeader } from "../../_components/page-header";
import { ExerciseForm } from "../../_components/exercise-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditExercisePage({ params }: Props) {
  const { id: exerciseId } = await params;
  const response = await getExerciseById(exerciseId);
  const tagResponse = await getAllTags();

  if (!response.success || !response.data) {
    // Optional: show an error UI or redirect
    return <div className="text-red-500 p-6">Exercise not found</div>;
  }

  const tags = tagResponse ?? [];
  const exercise = response.data;
  
  return (
    <div className="py-8 px-4">
      <PageHeader
        title="Edit Exercise"
        exerciseTitle={exercise.label}
        showBackButton={false}
        showNewButton={false}
      />
      <ExerciseForm exercise={exercise} availableTags={tags} isNew={false} />
    </div>
  );
}
