import imageRoutes from "./imagesRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
export default async function routes(fastify, options) {
  fastify.register(authRoutes);
  fastify.register(imageRoutes);
  fastify.register(userRoutes);
  fastify.register(collectionRoutes);
}
