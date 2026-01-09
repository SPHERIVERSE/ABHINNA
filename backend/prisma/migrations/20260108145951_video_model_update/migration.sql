/*
  Warnings:

  - You are about to drop the column `youtubeId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `videoUrl` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoCategory" AS ENUM ('STUDENT_STORY', 'ACHIEVEMENT', 'ALUMNI', 'INSTITUTE', 'FACULTY');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('LONG_FORM', 'SHORT');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "youtubeId",
ADD COLUMN     "category" "VideoCategory" NOT NULL DEFAULT 'INSTITUTE',
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "platform" TEXT NOT NULL DEFAULT 'YOUTUBE',
ADD COLUMN     "type" "VideoType" NOT NULL DEFAULT 'LONG_FORM',
ADD COLUMN     "videoUrl" TEXT NOT NULL;
