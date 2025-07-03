import { z } from "zod";

export const shopSchema = z.object({
  shop_id: z.string().uuid().optional(), // Généré automatiquement
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(1, "Le nom de la boutique est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  createdAt: z.date().optional(), // Auto-généré par Prisma
  updatedAt: z.date().optional(), // Auto-généré par Prisma
});
