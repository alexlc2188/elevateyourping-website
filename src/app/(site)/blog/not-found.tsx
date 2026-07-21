import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-4 ">
      <h2>404: Post not found!</h2>

      <Button asChild>
        <Link href={"/blog"}>Check Other Posts</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
