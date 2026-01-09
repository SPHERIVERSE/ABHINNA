/*
  Warnings:

  - You are about to drop the column `category` on the `Faculty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "category",
ADD COLUMN     "categories" "FacultyCategory"[] DEFAULT ARRAY['TEACHING']::"FacultyCategory"[],
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
