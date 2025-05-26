import { z } from "zod";

export const userItemSchema = z.object({
  user_id: z.string().uuid(),
  item_id: z.string().uuid(),
  is_favorite: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const userItemUpdateSchema = userItemSchema.partial({
  is_favorite: z.boolean().optional(),
  updatedAt: z.date().optional(),
});