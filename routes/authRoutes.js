import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userSchema } from "../schemas/userSchema.js";
import { prisma } from "../services/prisma.js"; 
import axios from "axios";

dotenv.config();

export default async function authRoutes(fastify, options) {
  // **Inscription**
  fastify.post("/auth/register", async (request, reply) => {
    try {
      // **Validation avec Zod**
      const validatedData = userSchema.parse(request.body);

      // Vérification si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (existingUser) {
        return reply.code(400).send({ error: "Email déjà utilisé" });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Création du nouvel utilisateur dans PostgreSQL
      const newUser = await prisma.user.create({
        data: {
          pseudo: validatedData.pseudo,
          email: validatedData.email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const token = jwt.sign({ user_id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      console.log(newUser);
      return reply.code(201).send({ message: "Utilisateur inscrit avec succès", user: newUser ,token:token});
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      return reply.code(400).send({ error: error.errors || "Erreur serveur" });
    }
  });

  // **Connexion**
  fastify.post("/auth/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Email et mot de passe requis" });
      }

      // Recherche de l'utilisateur dans la base
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }

      // Génération du token JWT
      const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // const n8n_response = await axios.get(process.env.N8N_WEBHOOK_URL,{
      //   data: {
          // pseudo: user.pseudo,
      //     email: user.email,
      //     createdAt: user.createdAt,
      //   },
      // });
      // console.log(n8n_response.data)

      return reply.send({ message: "Connexion réussie", token: token, user: user });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });
}
