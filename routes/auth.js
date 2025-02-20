import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const users = []; // Simulation d'une base de données (à remplacer par une vraie DB)

export default async function authRoutes(fastify, options) {
  // 🚀 Route d'inscription
  fastify.post("/auth/register", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Email et mot de passe requis" });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        return reply.code(400).send({ error: "Email déjà utilisé" });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Enregistrement de l'utilisateur
      const newUser = { id: users.length + 1, email, password: hashedPassword };
      users.push(newUser);

      return reply.code(201).send({ message: "Utilisateur inscrit avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // 🚀 Route de connexion
  fastify.post("/auth/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Email et mot de passe requis" });
      }

      // Vérifier si l'utilisateur existe
      const user = users.find((user) => user.email === email);
      if (!user) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }

      // Générer un token JWT
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return reply.send({ message: "Connexion réussie", token });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });
}
