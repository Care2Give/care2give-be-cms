import { Prisma } from "@prisma/client";
import prisma from "../../client";
import {
    getFindCampaignDonationsByDate,
    CampaignAndDonationsPayload
} from "../../types/SelectDonationByDate"
import { DurationFilter } from "../../types/DurationFilter";

const listCampaigns = async (startDate: Date | null, endDate: Date): Promise<CampaignAndDonationsPayload[]> => {
    return prisma.campaign.findMany({
        select: getFindCampaignDonationsByDate(startDate, endDate),
        orderBy: {
            createdAt: "desc",
        }
    });;
};


const getMostPopularAmounts = async (duration: DurationFilter): Promise<CampaignAndDonationsPayload[]> => {
    let startDate: Date | null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (duration) {
        case DurationFilter.Daily:
            startDate = getTwoDaysAgo();
            break;
        case DurationFilter.Weekly:
            startDate = getTwoWeekAgo();
            break;
        case DurationFilter.Monthly:
            startDate = getFirstDayOfLastMonth();
            break;
        case DurationFilter.Yearly:
            startDate = getFirstDayOfLastYear();
            break;
        case DurationFilter.AllTime:
            startDate = null;
            break;
    }

    const campaignWithDonations = prisma.campaign.findMany({
        select: getFindCampaignDonationsByDate(startDate, endDate),
        orderBy: {
            createdAt: "desc",
        }
    });

    const campaigns = (await campaignWithDonations).map(campaign => {
        const currentAmount: number = campaign.donations
            .filter(donation => donation.createdAt >= middleDate)
            .reduce((prev, newDonation) => prev + newDonation.dollars + newDonation.cents / 100, 0);

        const previousAmount: number = campaign.donations
            .filter(donation => donation.createdAt < middleDate)
            .reduce((prev, newDonation) => prev + newDonation.dollars + newDonation.cents / 100, 0);

        return ({
            ...campaign,
            amount: currentAmount,
            trend: currentAmount > previousAmount
        })
    })
    return campaigns;
}

export default {
    listCampaigns,
    getMostPopularAmounts,
};
