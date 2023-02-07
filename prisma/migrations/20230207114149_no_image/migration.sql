/*
  Warnings:

  - You are about to drop the column `imageId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_imageId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "imageId",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
