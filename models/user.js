import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (data) => {
  return await prisma.user.create({ data });
};

export const getUserById = async (user_id) => {
  return await prisma.user.findUnique({ where: { user_id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const updateUser = async (user_id, data) => {
  return await prisma.user.update({ where: { user_id }, data });
};

export const deleteUser = async (user_id) => {
  return await prisma.user.delete({ where: { user_id } });
};

export const getUserWithCollectionsAndItems = async (user_id) => {
  return await prisma.user.findUnique({
    where: { user_id },
    include: {
      collections: {
        include: {
          items: {
            include: {
              item: true, 
            },
          },
          type: true,
        },
      },
      favorites: {
        include: {
          item: true, 
        },
      },
    },
  });
};
