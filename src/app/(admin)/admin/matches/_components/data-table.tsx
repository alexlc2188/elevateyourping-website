"use client";

import {
  ColumnDef,
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  parseAsInteger,
  parseAsString,
  parseAsBoolean,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  columnFilterKey?: string; // e.g., "reviewFor"
  searchPlaceholder?: string;
  hideAdminMatches?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  searchPlaceholder,
  columnFilterKey,
  hideAdminMatches = process.env.NODE_ENV === "production",
}: DataTableProps<TData, TValue>) {
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

    // manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [{ query, page }, setQueryState] = useQueryStates({
    query: parseAsString.withDefault("").withOptions({ shallow: false }),
    page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  });

  const [adminFilter, setAdminFilter] = useQueryState(
    "hideAdminMatches",
    parseAsBoolean.withDefault(hideAdminMatches).withOptions({ shallow: false })
  );

  const [rawLimit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: true })
  );

  // ✅ Cap the limit to max 10 after parsing
  const limit = Math.min(rawLimit ?? 10, 10);
  const maxPage = Math.max(1, Math.ceil(total / limit));
  const handleNextPage = () => setQueryState({ page: page + 1 });
  const handlePreviousPage = () => setQueryState({ page: page - 1 });

  const handleSearchChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryState({ query: e.target.value, page: 1 }); // Reset to page 1 on new search
  };

  const handleAdminFilterChange = (checked: boolean) => {
    setAdminFilter(checked);
    setQueryState({ page: 1 }); // Reset to page 1 when filter changes
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 border-b">
        {/* Filter Controls Row */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hide-admin-matches"
              checked={adminFilter}
              onCheckedChange={handleAdminFilterChange}
            />
            <Label
              htmlFor="hide-admin-matches"
              className="text-sm font-medium whitespace-nowrap"
            >
              Hide admin matches
            </Label>
          </div>
        </div>

        {/* Search and Columns Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            {columnFilterKey && (
              <Input
                placeholder={searchPlaceholder ?? "Search..."}
                value={query}
                onChange={handleSearchChanged}
                className="max-w-sm"
              />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="px-4 py-2 bg-muted/50 text-xs uppercase tracking-wide font-semibold text-muted-foreground"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="hover:bg-muted/40 transition"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex flex-1 items-center justify-between px-4 py-3 border-t bg-muted/10">
        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page < 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
