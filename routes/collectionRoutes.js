import {
  getCollectionsByUserId,
  createCollection,
  deleteCollection,
} from "../models/collection.js";
import { userSchema } from "../schemas/userSchema.js";
import { prisma } from "../services/prisma.js";

import dotenv from "dotenv";

dotenv.config();

export default async function collectionRoutes(fastify, options) {
  fastify.get("/collections/:user_id", async (request, reply) => {
    try {
      const userId = request.params.user_id;
      const collections = await getCollectionsByUserId(userId);
      reply.send(collections);
    } catch (error) {
      reply.status(500).send({ error: "Error fetching collections" });
    }
  });
  fastify.post("/collections", async (request, reply) => {
    try {
      const validatedData = userSchema.parse(request.body);
      const collection = await createCollection(
        validatedData.user_id,
        validatedData.type_id
      );
      reply.send(collection);
    } catch (error) {
      reply.status(400).send({ error: error.errors });
    }
  });
  fastify.delete("/collections/:collection_id", async (request, reply) => {
    try {
      const collectionId = request.params.collection_id;
      const collection = await deleteCollection(collectionId);
      reply.send(collection);
    } catch (error) {
      reply.status(500).send({ error: "Error deleting collection" });
    }
  });
}
