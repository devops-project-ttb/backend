/*
  Warnings:

  - Added the required column `city` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ShopItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "stock_quantity" INTEGER;
