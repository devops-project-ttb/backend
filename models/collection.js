import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCollectionsByUserId = async (user_id) => {
  return await prisma.collection.findMany({
    where: { user_id },
    include: { type: true, items: { include: { item: true } } },
  });
};

export const createCollection = async (user_id, type_id) => {
  return await prisma.collection.create({
    data: { user_id, type_id },
  });
};

export const deleteCollection = async (collection_id) => {
  return await prisma.collection.delete({ where: { collection_id } });
};
