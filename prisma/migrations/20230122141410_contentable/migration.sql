/*
  Warnings:

  - You are about to drop the column `typeId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the `ArticleType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentTableEntry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contentTable` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_typeId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTableEntry" DROP CONSTRAINT "ContentTableEntry_articleId_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "typeId",
ADD COLUMN     "contentTable" JSONB NOT NULL,
ADD COLUMN     "imageId" INTEGER,
ADD COLUMN     "introduction" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "alt" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "ArticleType";

-- DropTable
DROP TABLE "ContentTableEntry";

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
