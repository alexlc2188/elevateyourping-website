"use server";

import { createFocusAreaIfNotExists, getFocusAreas, ensureDefaultFocusAreas } from "@/lib/services/focus-areas";

// Server action to get all focus areas
export async function getFocusAreasAction() {
  // Ensure default focus areas exist before fetching
  await ensureDefaultFocusAreas();
  return await getFocusAreas();
}

// Server action to create a focus area if it doesn't exist
export async function createFocusAreaAction(name: string) {
  if (!name || name.trim() === "") {
    return { success: false, error: "Focus area name is required" };
  }
  
  return await createFocusAreaIfNotExists(name.trim());
}
