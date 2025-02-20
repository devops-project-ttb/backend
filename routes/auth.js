import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const users = [
  { id: 1, email: "bilal.boussari@student.junia.com", password: await bcrypt.hash("password123", 10) },
  { id: 2, email: "theo.hinaut@student.junia.com", password: await bcrypt.hash("password123", 10) },
  { id: 3, email: "thomas.lefebvre@student.junia.com", password: await bcrypt.hash("password123", 10) },
  { id: 4, email: "mathieu.klimczak@ext.junia.com", password: await bcrypt.hash("password123", 10) },
];


export default async function authRoutes(fastify, options) {
  // Route pour l'inscription
  fastify.post("/auth/register", async (request, reply) => {
    try {
      const { email, password } = request.body;

      // Vérification des champs
      if (!email || !password) {
        return reply.code(400).send({ error: "Email et mot de passe requis" });
      }

      // Vérification si l'utilisateur existe déjà
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        return reply.code(400).send({ error: "Email déjà utilisé" });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création du nouvel utilisateur
      const newUser = { id: users.length + 1, email, password: hashedPassword };
      users.push(newUser);

      return reply.code(201).send({ message: "Utilisateur inscrit avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // Route pour la connexion
  fastify.post("/auth/login", async (request, reply) => {
    console.log('Tentative de connexion'); // Pour savoir si on rentre bien dans la fonction
    try {
      const { email, password } = request.body;
  
      console.log("Email:", email);
      console.log("Password:", password); // Log des valeurs envoyées dans la requête
  
      if (!email || !password) {
        return reply.code(400).send({ error: "Email et mot de passe requis" });
      }
  
      const user = users.find((user) => user.email === email);
      console.log("User trouvé:", user); // Log de l'utilisateur trouvé dans le tableau
      if (!user) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Mot de passe valide:", isMatch); // Log de la comparaison du mot de passe
      if (!isMatch) {
        return reply.code(401).send({ error: "Identifiants invalides" });
      }
  
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
