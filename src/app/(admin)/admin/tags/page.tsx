
import { getAllTags } from "@/lib/services/tags";
import { TagForm } from "./TagForm";
import { BackButton } from "@/components/back-button";
import { TagButton } from "./TagButton";

export default async function TagsAdminPage() {
  const tags = await getAllTags(); // SSR fetch from DB

  return (
    <main className="py-10 space-y-6">
      <BackButton />
      <div className="flex justify-center flex-col ">
        <h1 className="text-2xl font-bold mb-4">Manage Tags</h1>
        <TagForm />
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagButton id={tag.id} name={tag.name} key={tag.id} />
        ))}
      </div>
    </main>
  );
}
