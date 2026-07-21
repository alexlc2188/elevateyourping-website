"use client";
import { Button } from "@/components/ui/button";
import { convertDateToString } from "@/lib/utils";
import { Prisma, Purchase } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type PurchaseWithMatchOpponent = Prisma.PurchaseGetPayload<{
  include: {
    match: {
      select: {
        opponentName: true;
      };
    };
  };
}>;

export const Columns: ColumnDef<PurchaseWithMatchOpponent>[] = [
  {
    id: "createdAt",
    header: "Date",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      const date = convertDateToString(row.original.createdAt);
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="block max-w-[100px] truncate whitespace-nowrap overflow-hidden">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "match.opponentName",
    header: "Opponent",
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="block max-w-[200px] truncate whitespace-nowrap overflow-hidden">
        {row.original.match?.opponentName ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "priceCents",
    header: "Total",
    cell: ({ row }) => (
      <span
        title={row.original.id}
        className="block max-w-[100px] truncate whitespace-nowrap overflow-hidden">
        ${row.original.priceCents / 100}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Invoice",
    cell: ({ row }) => (
      <Button
        variant="link"
        className="text-blue-600"
        size="sm"
        onClick={async () => {
          const res = await fetch("/api/purchase/receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stripePaymentIntentId: row.original.stripePaymentIntentId,
            }),
          });

          const data = await res.json();

          if (res.ok && data.receiptUrl) {
            window.open(data.receiptUrl, "_blank");
          } else {
            alert("Unable to fetch receipt.");
          }
        }}>
        View
      </Button>
    ),
  },
];
