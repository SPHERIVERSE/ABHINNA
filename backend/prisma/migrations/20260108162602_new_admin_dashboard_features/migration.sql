-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'VISIT');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('ASSET', 'VIDEO', 'COURSE', 'BATCH', 'FACULTY', 'NOTIFICATION', 'SYSTEM');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "totalVisits" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "targetId" TEXT,
    "targetTitle" TEXT,
    "adminId" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_adminId_idx" ON "ActivityLog"("adminId");
