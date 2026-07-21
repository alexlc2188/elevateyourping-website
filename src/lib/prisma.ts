import { PrismaClient } from "@prisma/client";

// Use existing prisma instance if available in global scope (for dev hot reloading)
// Otherwise create a new instance
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
  