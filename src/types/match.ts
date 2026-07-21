import { Match as PrismaMatch } from "@prisma/client";

export interface Match extends PrismaMatch {
  location?: string;
  imageUrl?: string;
  type?: string; // e.g., "Semifinal", "Final", etc.
  score?: string;
}
