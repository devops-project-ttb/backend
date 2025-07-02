/*
  Warnings:

  - You are about to drop the column `collection_id` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_collection_id_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "collection_id";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shop_email_key" ON "Shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "Shop"("name");
