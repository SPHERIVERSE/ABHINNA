-- CreateEnum
CREATE TYPE "FacultyCategory" AS ENUM ('TEACHING', 'LEADERSHIP');

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "category" "FacultyCategory" NOT NULL DEFAULT 'TEACHING';
