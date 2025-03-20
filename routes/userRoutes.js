import { getUserById, getAllUsers, updateUser, deleteUser } from "../models/user.js";

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
}
