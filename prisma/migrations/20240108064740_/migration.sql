-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('ANONYMOUS', 'INDIVIDUAL_WITH_TAX_DEDUCTION', 'GROUP_WITH_TAX_DEDUCTION', 'WITHOUT_TAX_DEDUCTION');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SGD',
    "dollars" INTEGER NOT NULL DEFAULT 0,
    "cents" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "imageUrl" TEXT[],

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDonationAmount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SGD',
    "dollars" INTEGER NOT NULL DEFAULT 0,
    "cents" INTEGER NOT NULL DEFAULT 0,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignDonationAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" SERIAL NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donationType" VARCHAR(255) NOT NULL,
    "donorFirstName" TEXT,
    "donorLastName" TEXT,
    "donorEmail" TEXT,
    "donorNricA" TEXT,
    "donorNricB" VARCHAR(4),
    "donorTrainingPrograms" TEXT[],
    "currency" VARCHAR(3) NOT NULL DEFAULT 'SGD',
    "dollars" INTEGER NOT NULL DEFAULT 0,
    "cents" INTEGER NOT NULL DEFAULT 0,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CampaignDonationAmount" ADD CONSTRAINT "CampaignDonationAmount_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
