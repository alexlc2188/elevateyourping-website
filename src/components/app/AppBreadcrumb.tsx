"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  opponentName?: String;
}

export const AppBreadcrumb = ({ opponentName }: Props) => {
  const pathname = usePathname(); // e.g. "/insights/review/123"
  const segments = pathname.split("/").filter(Boolean); // remove empty strings

  if (segments.length < 2) {
    return null;
  }

  return (
    <Breadcrumb className=" pt-4 lg:pt-8">
      <BreadcrumbList className="flex items-center ">
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          // If segment is the matchId and we have opponentName, show it
          const isMatchId =
            index === segments.length - 1 && /^[a-f0-9]{24}$/i.test(segment);

          // Special case for log-match page - show "New Match Review" instead
          const isLogMatchPage = segment === "log-match";

          const label =
            isMatchId && opponentName
              ? ` vs ${opponentName}`
              : isLogMatchPage
              ? "New Match Review"
              : decodeURIComponent(segment)
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-primary font-semibold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="mx-1 text-slate-400 align-middle" />
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
