"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { convertDateToString } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchLog } from "@/lib/services/matches";

export function MatchLogTable({
  data,
  onSelectMatch,
}: {
  data: MatchLog[];
  onSelectMatch: (match: MatchLog) => void;
}) {
  const columns: ColumnDef<MatchLog>[] = [
    {
      id: "matchDate",
      header: "Date",
      accessorFn: (row) => row.matchDate,
      cell: ({ row }) => {
        const date = convertDateToString(row.original.matchDate);
        return <span>{date}</span>;
      },
    },
    {
      accessorKey: "opponentName",
      header: "Opponent",
      cell: ({ row }) => (
        <span
          title={row.original.opponentName}
          className="block max-w-[100px] truncate whitespace-nowrap overflow-hidden">
          {row.original.opponentName}
        </span>
      ),
    },
    {
      accessorKey: "finalScore",
      header: "Score",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link href={`/app/matches/${row.original.id}`}>
          <Button variant="link" className="text-blue-600" size="sm">
            View
          </Button>
        </Link>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader className="bg-secondary/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-sm font-semibold">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-muted/30">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
