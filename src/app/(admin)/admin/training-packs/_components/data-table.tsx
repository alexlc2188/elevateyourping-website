"use client";

import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { parseAsString } from "nuqs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { DataTableProps } from "./types";

export function TrainingPackDataTable({
  columns,
  data,
  total,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [{ query, page }, setQueryState] = useQueryStates({
    query: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
  });

  const [searchInput, setSearchInput] = useState(query);
  const [debouncedQuery] = useDebounce(searchInput, 400);

  const [rawLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const limit = Math.min(rawLimit ?? 10, 10);

  useEffect(() => {
    setQueryState({ query: debouncedQuery, page: 1 });
  }, [debouncedQuery]);

  const handleNextPage = () => setQueryState({ page: page + 1 });
  const handlePreviousPage = () =>
    page > 1 && setQueryState({ page: page - 1 });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="w-full space-y-4 px-4 py-4 border-b bg-muted/10">
          <Input
            placeholder="Search training packs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full max-w-2xl"
          />

          <div className="flex flex-wrap gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize"
                      checked={col.getIsVisible()}
                      onCheckedChange={(value) =>
                        col.toggleVisibility(!!value)
                      }>
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 bg-muted/50 text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 transition"
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/10 w-full">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
            {total} packs
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page <= 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
