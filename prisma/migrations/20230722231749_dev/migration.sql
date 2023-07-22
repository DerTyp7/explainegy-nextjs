-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_svgId_fkey";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_svgId_fkey" FOREIGN KEY ("svgId") REFERENCES "Svg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
