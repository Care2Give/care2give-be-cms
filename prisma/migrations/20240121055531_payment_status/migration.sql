/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Campaign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentId` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DonationPaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "imageUrl",
ADD COLUMN     "imageNames" TEXT[],
ADD COLUMN     "imageUrls" TEXT[];

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" "DonationPaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Donation_paymentId_key" ON "Donation"("paymentId");
