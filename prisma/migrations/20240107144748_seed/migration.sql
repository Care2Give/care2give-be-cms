-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "dollars" INTEGER NOT NULL,
    "cents" INTEGER NOT NULL,
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
    "currency" TEXT NOT NULL,
    "dollars" INTEGER NOT NULL,
    "cents" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignDonationAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "version" SERIAL NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donorFirstName" TEXT NOT NULL,
    "donorLastName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorNricA" TEXT NOT NULL,
    "donorNricB" TEXT NOT NULL,
    "donorTrainingPrograms" TEXT[],
    "currency" TEXT NOT NULL,
    "dollars" INTEGER NOT NULL,
    "cents" INTEGER NOT NULL,
    "campaignId" TEXT NOT NULL,
    "typeOfDonation" VARCHAR(20) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_content_key" ON "Email"("content");

-- AddForeignKey
ALTER TABLE "CampaignDonationAmount" ADD CONSTRAINT "CampaignDonationAmount_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
