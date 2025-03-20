import { z } from "zod";

export const collectionSchema = z.object({
  collection_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  createdAt: z.date().default(() => new Date()),
  type_id: z.string().uuid(),
  items: z.array(z.string().uuid()).optional(), 
});
