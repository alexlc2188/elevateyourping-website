import { ColumnDef } from "@tanstack/react-table";
import { TrainingPackWithExercises } from "./types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function getTrainingPackColumns(): ColumnDef<
  TrainingPackWithExercises,
  any
>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => (
        <Badge>{row.original?.level ?? "Not entered yet."}</Badge>
      ),
    },
    {
      id: "exerciseCount",
      header: "# Exercises",
      cell: ({ row }) => row.original.exercises.length,
    },
    {
      accessorKey: "isPublished",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Is Published
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isPublished = row.original.isPublished;
        return (
          <p
            className={cn(
              "",
              isPublished === true ? "text-green-500" : "text-red-500",
            )}>
            {isPublished ? "Published" : "Not published"}
          </p>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span>{format(new Date(row.original.createdAt), "dd MMM yyyy")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/admin/training-packs/${row.original.id}/edit`}>
          <Button variant="outline" size="sm">
            Modify
          </Button>
        </Link>
      ),
    },
  ];
}
