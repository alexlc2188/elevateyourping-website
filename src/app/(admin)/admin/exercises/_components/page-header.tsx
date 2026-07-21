"use client";

import { Button } from "@/components/ui/button";
import { ExerciseBreadcrumbs } from "./exercise-breadcrumbs";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";

interface PageHeaderProps {
  title: string;
  exerciseTitle?: string;
  showBackButton?: boolean;
  showNewButton?: boolean;
  showDraftsButton?: boolean;
  showPublishedButton?: boolean;
  backUrl?: string;
}

export const PageHeader = ({
  title,
  exerciseTitle,
  showBackButton = false,
  showNewButton = false,
  showDraftsButton = false,
  showPublishedButton = false,
  backUrl,
}: PageHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const isAssignmentPage = pathname.includes("assignments");

  return (
    <div className="mb-6">
      {isAssignmentPage ? (
        <div className="mb-4">
          <AppBreadcrumb />
        </div>
      ) : (
        <ExerciseBreadcrumbs exerciseTitle={exerciseTitle} />
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <h1 className="text-2xl ">{title}</h1>
        </div>

        <div className="flex gap-2">
          {showDraftsButton && (
            <Link href="/admin/exercises/drafts">
              <Button variant="outline">View Drafts</Button>
            </Link>
          )}

          {showPublishedButton && (
            <Link href="/admin/exercises">
              <Button variant="outline">View Published</Button>
            </Link>
          )}

          {showNewButton && (
            <Link href="/admin/exercises/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Exercise
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
