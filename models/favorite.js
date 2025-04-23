import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFavoritesByUserId = async (user_id) => {
  return await prisma.favorite.findMany({
    where: { user_id },
    include: { item: true },
  });
};

export const addFavorite = async (user_id, item_id) => {
  return await prisma.favorite.create({
    data: { user_id, item_id },
  });
};

export const removeFavorite = async (user_id, item_id) => {
  return await prisma.favorite.delete({
    where: { user_id_item_id: { user_id, item_id } },
  });
};
