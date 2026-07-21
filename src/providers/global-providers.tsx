"use client";

import { Toaster } from "sonner";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProvider,
} from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
