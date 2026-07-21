"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface ExerciseBreadcrumbsProps {
  items?: BreadcrumbItem[];
  exerciseTitle?: string;
}

export const ExerciseBreadcrumbs = ({
  items = [],
  exerciseTitle,
}: ExerciseBreadcrumbsProps) => {
  const pathname = usePathname();
  
  // Default breadcrumb paths based on current URL
  const defaultItems: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin" },
    { label: "Exercises", href: "/admin/exercises" },
  ];
  
  // If we're in drafts, add that
  if (pathname.includes("/drafts")) {
    defaultItems.push({ label: "Drafts", href: "/admin/exercises/drafts" });
  }
  
  // If we're editing an exercise and have a title, add that
  if (pathname.includes("/edit-info") && exerciseTitle) {
    defaultItems.push({ 
      label: exerciseTitle, 
      href: pathname,
      active: true
    });
  }
  
  // If we're creating a new exercise
  if (pathname.includes("/create")) {
    defaultItems.push({ 
      label: "New Exercise", 
      href: pathname,
      active: true
    });
  }
  
  // Combine default items with any custom items
  const allItems = items.length > 0 ? items : defaultItems;

  return (
    <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/admin"
            className="inline-flex items-center text-slate-500 hover:text-slate-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Admin
          </Link>
        </li>
        
        {allItems.slice(1).map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
            {item.active ? (
              <span className="text-blue-600 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-slate-700"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
