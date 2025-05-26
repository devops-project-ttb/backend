import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const getItemsByUserId = async (user_id) => {
  return await prisma.userItem.findMany({
    where: { user_id },
    include: {
      item: true, 
    },
  });
}

export const addItemToUser = async (user_id, item_id) => {
  return await prisma.userItem.create({
    data: { user_id, item_id },
  });
}

export const addItemToFavorites = async (user_id, item_id) => {
    return await prisma.userItem.update({
    where: { user_id_item_id: { user_id, item_id } },
    data: { is_favorite: true ,updatedAt: new Date() },
  });
}

export const removeItemFromFavorites = async (user_id, item_id) => {
  return await prisma.userItem.update({
    where: { user_id_item_id: { user_id, item_id } },
    data: { is_favorite: false, updatedAt: new Date() },
  });
}