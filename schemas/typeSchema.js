import { z } from "zod";

export const typeSchema = z.object({
  type_id: z.string().uuid().optional(),
  type_name: z.string().min(1, "Le nom du type est requis"),
});
