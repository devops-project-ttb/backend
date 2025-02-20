import imageRoutes from "./images.js";
import authRoutes from "./auth.js";
export default async function routes(fastify, options) {
  fastify.register(authRoutes);
  fastify.register(imageRoutes);
}
