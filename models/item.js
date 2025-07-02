import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getItemsByUserId = async (user_id) => {
  return await prisma.userItem.findMany({
    where: { user_id },
    include: {
      item: true,
    },
  });
};

export const getFavoritesByUserId = async (user_id) => {
  return await prisma.userItem.findMany({
    where: { user_id, is_favorite: true },
    include: {
      item: true,
    },
  });
};

export const getLastItemByUserId = async (user_id) => {
  return await prisma.userItem.findFirst({
    where: { user_id },
    orderBy: { createdAt: "desc" },
    include: {
      item: true,
    },
  });
};

export const addItemToUser = async (user_id, item_id) => {
  return await prisma.userItem.create({
    data: { user_id, item_id },
  });
};

export const addItemToFavorites = async (user_id, item_id) => {
  return await prisma.userItem.update({
    where: { user_id_item_id: { user_id, item_id } },
    data: { is_favorite: true, updatedAt: new Date() },
  });
};

export const removeItemFromFavorites = async (user_id, item_id) => {
  return await prisma.userItem.update({
    where: { user_id_item_id: { user_id, item_id } },
    data: { is_favorite: false, updatedAt: new Date() },
  });
};

export const findSimilarItem = async (item_name) => {
  const result = await prisma.$queryRaw`
    SELECT *
    FROM "Item"
    WHERE similarity(item_name, ${item_name}) > 0.6
    ORDER BY similarity(item_name, ${item_name}) DESC
    LIMIT 1;
  `;
  return result[0] || null;
};
