/*
  Warnings:

  - You are about to drop the column `code` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `codeHash` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "code",
ADD COLUMN     "codeHash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OtpRequest" (
    "phone" TEXT NOT NULL,
    "ipAddress" TEXT,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "dailyCount" INTEGER NOT NULL DEFAULT 0,
    "lastRequestedAt" TIMESTAMP(3) NOT NULL,
    "blockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpRequest_pkey" PRIMARY KEY ("phone")
);

-- CreateIndex
CREATE INDEX "Otp_phone_idx" ON "Otp"("phone");
