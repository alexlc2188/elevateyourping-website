import { prismaDb } from "../db";

// Get all focus areas
export async function getFocusAreas() {
  try {
    const focusAreas = await prismaDb.focusArea.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: focusAreas };
  } catch (error) {
    console.error("Error fetching focus areas:", error);
    return { success: false, data: [] };
  }
}

// Create a focus area if it doesn't exist
export async function createFocusAreaIfNotExists(name: string) {
  try {
    const existingFocusArea = await prismaDb.focusArea.findUnique({
      where: { name },
    });

    if (existingFocusArea) {
      return { success: true, data: existingFocusArea };
    }

    const newFocusArea = await prismaDb.focusArea.create({
      data: { name },
    });

    return { success: true, data: newFocusArea };
  } catch (error) {
    console.error("Error creating focus area:", error);
    return { success: false, error: "Failed to create focus area", data: null };
  }
}

// Ensure default focus areas exist
export async function ensureDefaultFocusAreas() {
  const defaultFocusAreas = ["Footwork", "Third Ball", "Service", "Receive", "Rallying"];
  
  try {
    for (const name of defaultFocusAreas) {
      await createFocusAreaIfNotExists(name);
    }
    return { success: true };
  } catch (error) {
    console.error("Error ensuring default focus areas:", error);
    return { success: false, error: "Failed to ensure default focus areas" };
  }
}
