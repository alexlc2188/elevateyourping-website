import { prismaDb } from "@/lib/db";
import { columns } from "./_components/columns";
import { PageHeaderGeneric } from "../_components/page-header-generic";
import { z } from "zod";
import { SortingState } from "@tanstack/react-table";
import { DataTable } from "./_components/data-table";
import { MatchBreadcrumbs } from "./_components/match-breadcrumbs";
import { MatchesWithUser } from "./_components/columns";
import { UserRole, MatchOffer } from "@prisma/client";

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce
    .number()
    .optional()
    .default(10)
    .transform((val) => Math.min(val, 10)), // Ensure limit never exceeds 10
  query: z.string().optional(),
  hideAdminMatches: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => {
      // Default behavior:
      // - Development: Show all matches (including admin test matches)
      // - Production: Hide admin matches (show only real user matches)
      const defaultValue = process.env.NODE_ENV === "production";

      if (val === undefined) return defaultValue;
      if (typeof val === "boolean") return val;
      if (typeof val === "string") {
        return val.toLowerCase() === "true";
      }
      return defaultValue;
    }),
  sort: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      try {
        return JSON.parse(val) as SortingState;
      } catch {
        return [];
      }
    }),
});

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchesAdminPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const { page, limit, sort, query, hideAdminMatches } =
    querySchema.parse(resolvedSearchParams);
  const skip = (page - 1) * limit;

  // Convert TanStack sorting state to Prisma orderBy
  const orderBy =
    sort.length > 0
      ? sort.reduce(
          (acc, { id, desc }) => ({
            ...acc,
            [id]: desc ? "desc" : "asc",
          }),
          {}
        )
      : { createdAt: "desc" }; // Default sorting

  // Build where clause
  const userFilter: any = {};

  if (query) {
    userFilter.name = {
      contains: query,
      mode: "insensitive" as const,
    };
  }

  if (hideAdminMatches) {
    userFilter.role = {
      notIn: [UserRole.ADMIN, UserRole.COACH, UserRole.OWNER],
    };
  }

  const where: any = {
    offerType: {
      not: MatchOffer.LOG,
    },
  };

  // Only add user filter if we have actual filters to apply
  if (Object.keys(userFilter).length > 0) {
    where.user = userFilter;
  }

  const [matches, total] = await Promise.all([
    prismaDb.match.findMany({
      where,
      take: limit,
      skip,
      orderBy,
      select: {
        id: true,
        opponentName: true,
        eventName: true,
        isPublished: true,
        createdAt: true,
        offerType: true,
        paymentStatus: true,
        user: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    }) as unknown as MatchesWithUser[],
    prismaDb.match.count({ where }),
  ]);

  return (
    <main className="">
      <div className="mt-6 mb-2">
        <MatchBreadcrumbs />
      </div>
      <PageHeaderGeneric header="All Matches (Latest 10)" />
      <DataTable
        columns={columns}
        data={matches}
        total={total}
        columnFilterKey="reviewFor"
        searchPlaceholder="Search by user..."
        hideAdminMatches={hideAdminMatches}
      />
    </main>
  );
}
