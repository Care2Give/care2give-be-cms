import prisma from "../../client";
import {
    getFindCampaignDonationsByDate,
    CampaignAndDonationsPayload
} from "../../types/SelectDonationByDate"

const listCampaignsWithDonations = async (startDate: Date | null, endDate: Date): Promise<CampaignAndDonationsPayload[]> => {
    return prisma.campaign.findMany({
        select: getFindCampaignDonationsByDate(startDate, endDate),
        orderBy: {
            createdAt: "desc",
        }
    });;
};

const queryCampaign = async (id: string) => {
    return prisma.campaign.findUnique({
      where: {
        id,
      },
      include: {
        donationAmounts: true,
        donations: true,
      },
    });
  };

export default {
    listCampaignsWithDonations,
    queryCampaign
};
