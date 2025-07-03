import { z } from "zod";

export const shopItemSchema = z.object({
  shop_id: z.string().uuid(),
  item_id: z.string().uuid(),
  is_available: z.boolean().optional().default(true),
  price: z.number().min(0, "Le prix doit être positif"),
  stock_quantity: z.number().int().nonnegative().optional(),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  updatedAt: z
    .date()
    .optional()
    .default(() => new Date()),
});
