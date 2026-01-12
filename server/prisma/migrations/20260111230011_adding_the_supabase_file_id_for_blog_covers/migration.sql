/*
  Warnings:

  - A unique constraint covering the columns `[blogImgFileId]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blogImgFileId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blogImgFileId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blog_blogImgFileId_key" ON "Blog"("blogImgFileId");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_blogImgFileId_fkey" FOREIGN KEY ("blogImgFileId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
