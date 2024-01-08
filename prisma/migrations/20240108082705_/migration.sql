/*
  Warnings:

  - You are about to drop the column `title` on the `CampaignDonationAmount` table. All the data in the column will be lost.
  - Changed the type of `donationType` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CampaignDonationAmount" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "donationType",
ADD COLUMN     "donationType" "DonationType" NOT NULL;
