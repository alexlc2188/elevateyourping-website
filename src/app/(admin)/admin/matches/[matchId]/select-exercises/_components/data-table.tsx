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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";
import { Tag, TrainingPlanExercise } from "@prisma/client";

export interface DataTableProps<
  TData extends { id: string; label: string },
  TValue,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  availableTags: Tag[];
  trainingPlanExercises: TrainingPlanExercise[];
}

export function DataTable<TData extends { id: string; label: string }, TValue>({
  columns,
  data,
  availableTags,
  total,
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

  const [
    { query, page, skillLevel, intensityScore, tags, focusAreas },
    setQueryState,
  ] = useQueryStates({
    query: parseAsString.withDefault("").withOptions({ shallow: false }),
    page: parseAsInteger.withDefault(1).withOptions({ shallow: false }),
    skillLevel: parseAsString.withDefault("").withOptions({ shallow: false }),
    intensityScore: parseAsInteger
      .withDefault(NaN)
      .withOptions({ shallow: false }),
    tags: parseAsString.withDefault("").withOptions({ shallow: false }),
    focusAreas: parseAsString.withDefault("").withOptions({ shallow: false }),
  });

  const [searchInput, setSearchInput] = useState(query); // local typing
  const [debouncedQuery] = useDebounce(searchInput, 400);

  const [rawLimit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10).withOptions({ shallow: true }),
  );

  // ✅ Cap the limit to max 10 after parsing
  const limit = Math.min(rawLimit ?? 10, 10);

  // Keep sync with URL when user stops typing
  useEffect(() => {
    setQueryState({ query: debouncedQuery, page: 1 });
  }, [debouncedQuery]);

  const handleNextPage = () => setQueryState({ page: page + 1 });

  const handlePreviousPage = () => {
    if (page > 1) {
      setQueryState({ page: page - 1 });
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="w-full space-y-4 px-4 py-4 border-b bg-muted/10">
          {/* Full-width search bar on its own line */}
          <div className="w-full">
            <Input
              placeholder="Search exercises..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full max-w-2xl"
            />
          </div>

          {/* Filters in a responsive horizontal group */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Skill Level */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[160px] justify-between">
                  {skillLevel === "" || skillLevel === undefined
                    ? "All Levels"
                    : skillLevel.charAt(0) + skillLevel.slice(1).toLowerCase()}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={skillLevel || "NONE"}
                  onValueChange={(value) =>
                    setQueryState({
                      skillLevel: value === "NONE" ? "" : value,
                      page: 1,
                    })
                  }>
                  <DropdownMenuRadioItem value="NONE">
                    All Levels
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="BEGINNER">
                    Beginner 🟢
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="INTERMEDIATE">
                    Intermediate 🟡
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ADVANCED">
                    Advanced 🔴
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[160px] justify-between">
                  Tags{" "}
                  {tags && tags.split(",").filter(Boolean).length > 0
                    ? `(${tags.split(",").filter(Boolean).length})`
                    : ""}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="max-h-64 overflow-y-auto">
                {availableTags.map((tag) => {
                  const selected = tags.split(",").includes(tag.id); // convert to array here
                  return (
                    <DropdownMenuCheckboxItem
                      key={tag.id}
                      checked={selected}
                      onCheckedChange={(checked) => {
                        const selectedTags = tags.split(",").filter(Boolean); // ensure it's always an array

                        const updated = checked
                          ? [...selectedTags, tag.id]
                          : selectedTags.filter((id) => id !== tag.id);

                        setQueryState({
                          tags: updated.join(","), // back to URL-safe format
                          page: 1,
                        });
                      }}>
                      {tag.name}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Intensity Score */}
            <Input
              type="number"
              placeholder="Min Intensity"
              value={isNaN(intensityScore) ? "" : intensityScore}
              onChange={(e) => {
                const val = e.target.value;
                setQueryState({
                  intensityScore: val ? parseInt(val) : NaN,
                  page: 1,
                });
              }}
              className="w-40"
            />

            {/* Column toggle dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
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
                      key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
        {/* Pagination */}
        <div className="flex flex-1  items-center justify-between px-4 py-3 border-t bg-muted/10">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
            {total} exercises
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
        {/* Summary of selected exercises */}
      </div>
    </div>
  );
}
