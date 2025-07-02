import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../models/user.js";
import { userSchema } from "../schemas/userSchema.js";
import { userItemSchema, userItemUpdateSchema } from "../schemas/userItem.js";
import {
  getItemsByUserId,
  addItemToUser,
  addItemToFavorites,
  removeItemFromFavorites,
  getLastItemByUserId,
} from "../models/item.js";
import dotenv from "dotenv";
dotenv.config();

export default async function userRoutes(fastify, options) {
  fastify.get("/users/:id", async (request, reply) => {
    const user = await getUserById(request.params.id);
    reply.send(user || { message: "User not found" });
  });

  fastify.get("/users", async (request, reply) => {
    const users = await getAllUsers();
    reply.send(users);
  });

  fastify.put("/users/:id", async (request, reply) => {
    try {
      const validatedData = userSchema.parse(request.body);
      const user = await updateUser(request.params.id, validatedData);
      reply.send(user);
    } catch (error) {
      reply.status(400).send({ error: error.errors });
    }
  });

  fastify.delete("/users/:id", async (request, reply) => {
    await deleteUser(request.params.id);
    reply.send({ message: "User deleted" });
  });

  fastify.get("/users/:id/items", async (request, reply) => {
    const items = await getItemsByUserId(request.params.id);
    reply.send(items);
  });

  fastify.get("/users/:id/lastItem", async (request, reply) => {
    const userItem = await getLastItemByUserId(request.params.id);

    if (!userItem) {
      return reply.send({ message: "No items found for this user" });
    }

    // Combine userItem and item data
    const item = {
      ...userItem.item,
      is_favorite: userItem.is_favorite, // 👈 on ajoute ce champ
    };

    reply.send({ item });
  });

  fastify.post("/users/:id/addItem", async (request, reply) => {
    try {
      const validatedData = userItemSchema.parse(request.body);
      const item = await addItemToUser(
        request.params.id,
        validatedData.item_id
      );
      reply.send(item);
    } catch (error) {
      reply.status(400).send({ error: error.errors });
    }
  });

  fastify.post("/users/:id/addFavorite", async (request, reply) => {
    try {
      const validatedData = userItemUpdateSchema.parse(request.body);
      const item = await addItemToFavorites(
        request.params.id,
        validatedData.item_id
      );
      reply.send(item);
    } catch (error) {
      reply.status(400).send({ error: error.errors });
    }
  });

  fastify.post("/users/:id/removeFavorite", async (request, reply) => {
    try {
      const validatedData = userItemUpdateSchema.parse(request.body);
      const item = await removeItemFromFavorites(
        request.params.id,
        validatedData.item_id
      );
      reply.send(item);
    } catch (error) {
      reply.status(400).send({ error: error.errors });
    }
  });

  fastify.get("/users/:id/favorites", async (request, reply) => {
    const favorites = await getItemsByUserId(request.params.id);
    reply.send(favorites);
  });
}
