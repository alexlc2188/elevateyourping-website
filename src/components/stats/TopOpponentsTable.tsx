"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { OpponentStats } from "./TopOpponentsView";
import { Table, TableHeader } from "../ui/table";

export function TopOpponentsTable({
  data,
  onSelectOpponent,
}: {
  data: OpponentStats[];
  onSelectOpponent: (opponent: OpponentStats) => void;
}) {
  const columns: ColumnDef<OpponentStats>[] = [
    {
      accessorKey: "name",
      header: "Opponent",
    },
    {
      accessorKey: "count",
      header: "Matches",
    },
    {
      accessorFn: (row) => `${row.wins}–${row.losses}`,
      header: "W–L",
      id: "winLoss",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => onSelectOpponent(row.original)}>
          View
        </Button>
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
      <Table className="min-w-full divide-y divide-slate-300">
        <TableHeader className="bg-secondary/40">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-medium text-slate-900">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </TableHeader>
        <tbody className="bg-white divide-y divide-slate-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-sm text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
