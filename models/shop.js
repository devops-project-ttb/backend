import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getShopsByItem = async (item_id) => {
  return await prisma.shopItem.findMany({
    where: { item_id },
    include: {
      shop: true,
    },
  });
};


