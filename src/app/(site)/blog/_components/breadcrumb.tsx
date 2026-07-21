"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export const BlogBreadcrumb = () => {
  const pathname = usePathname(); // e.g. "/blog/forehand-drive-technique"
  const slug = pathname.split("/")[2];

  if (!slug) return null;

  const label = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Breadcrumb className="pt-4 lg:pt-8 text-muted-foreground text-sm">
      <BreadcrumbList className="flex items-center gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/blog"
              className="hover:underline font-medium text-muted-foreground">
              Blog
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-slate-400" />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-primary font-medium">
            {label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
