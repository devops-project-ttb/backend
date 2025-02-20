import Fastify from "fastify";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import fastifyCors from 'fastify-cors'; // Import du plugin CORS

dotenv.config();

const fastify = Fastify({ logger: true });

// Enregistrer le plugin CORS
fastify.register(fastifyCors, {
  origin: "*", // Accepter toutes les origines (à personnaliser selon tes besoins)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes autorisées
  allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
});

fastify.register(routes);

fastify.get("/", async (request, reply) => {
  return { message: "Hello Fastify!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 5000, host: "0.0.0.0" });
    console.log(
      `🚀 Server running at http://localhost:${process.env.PORT || 5000}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
