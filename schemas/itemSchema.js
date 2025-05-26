import { z } from "zod";

export const itemSchema = z.object({
  item_id: z.string().uuid().optional(),
  type_id: z.string().uuid(),
  collection_id: z.string().uuid(),
  item_name: z.string().min(1, "Le nom de l'item est requis"),
  image: z.string().url("Image invalide").optional(),
  provenance: z.string().optional(),
  description: z.string().optional(),
  note: z.number().min(0).max(5).optional(),
  aromes: z.array(z.string()),
  accords: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
