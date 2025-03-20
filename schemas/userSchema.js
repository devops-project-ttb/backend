import { z } from "zod";

export const userSchema = z.object({
  pseudo: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});