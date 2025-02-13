import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return { message: "Hello Fastify!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 5000, host: "0.0.0.0" });
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();