import { UserRole } from "@prisma/client";
import { z } from "zod";

export const userRoleFormSchema = z.object({
  role: z.nativeEnum(UserRole),
});
