-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('ENTRANCE', 'ACADEMIC');

-- CreateEnum
CREATE TYPE "Stream" AS ENUM ('SCIENCE', 'ARTS', 'COMMERCE', 'NONE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "category" "CourseCategory" NOT NULL DEFAULT 'ENTRANCE',
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "stream" "Stream" NOT NULL DEFAULT 'NONE';
