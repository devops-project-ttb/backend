/*
  Warnings:

  - You are about to drop the `CollectionItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collection_name` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_id` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "CollectionItem" DROP CONSTRAINT "CollectionItem_item_id_fkey";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "collection_name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "collection_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CollectionItem";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("collection_id") ON DELETE RESTRICT ON UPDATE CASCADE;
