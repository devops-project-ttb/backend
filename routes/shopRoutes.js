import { getShopsByItem } from "../models/shop.js";

export default async function shopRoutes(fastify, options) {
  fastify.get("/item/:id/shops", async (request, reply) => {
    const shops = await getShopsByItem(request.params.id);
    reply.send(shops);
    return shops;
  });
}
