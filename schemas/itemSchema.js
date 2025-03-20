import { z } from "zod";

export const itemSchema = z.object({
    item_id: z.string().uuid(), 
    type_id: z.string().uuid(),
    item_name: z.string().min(1, "Le nom de l'item est requis"),
    image: z.string().url().optional(),
    provenance: z.string(),
    description: z.string(),
    note: z.number().float().min(0).max(5), 
    aromes: z.array(z.string()),
    accords: z.array(z.string()).optional(),
    createdAt: z.date().default(() => new Date()),
  });
  