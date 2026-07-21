"use client";

import { Match, MatchPaymentStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown, Eye, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type MatchesWithUser = Pick<
  Match,
  | "id"
  | "opponentName"
  | "eventName"
  | "isPublished"
  | "createdAt"
  | "offerType"
  | "paymentStatus"
> & {
  user: {
    name: string | null;
    role: string;
  } | null;
};

export const columns: ColumnDef<MatchesWithUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "reviewFor",
    header: "Review for",
    accessorFn: (row) => row.user?.name ?? "Unknown",
    cell: ({ row }) => {
      const name = row.original.user?.name ?? "Unknown";
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "opponentName",
    header: "Opponent",
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.original.isPublished;
      return (
        <Badge variant={isPublished ? "success" : "destructive"}>
          {isPublished ? "Published" : "Not Published"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "eventName",
    header: "Event",
  },
  {
    accessorKey: "offerType",
    header: "Offer Type",
    cell: ({ row }) => {
      const offerType = row.original.offerType;
      return (
        <span className="capitalize">{offerType?.toLowerCase() || "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus;

      const getPaymentStatusVariant = (status: string) => {
        switch (status) {
          case "PURCHASED":
            return "success";
          case "PENDING":
            return "secondary";
          case "FAILED":
            return "destructive";
          case "EXPIRED":
            return "destructive";
          case "CANCELLED":
            return "secondary";
          case "REFUNDED":
            return "secondary";
          case "REQUIRES_ACTION":
            return "default";
          default:
            return "secondary";
        }
      };

      return (
        <Badge variant={getPaymentStatusVariant(paymentStatus)}>
          {paymentStatus?.replace(/_/g, " ") || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <span>{format(new Date(date), "dd MMM yyyy")}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const matchId = row.original.id;

      return (
        <div className="flex items-center gap-1">
          <Link href={`/admin/matches/${matchId}/review`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit/Review</span>
            </Button>
          </Link>
          <Link href={`/app/matches/${matchId}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View as User</span>
            </Button>
          </Link>
        </div>
      );
    },
  },
];
