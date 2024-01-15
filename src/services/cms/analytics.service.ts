import { Prisma } from "@prisma/client";
import prisma from "../../client";
import {
    getFindCampaignDonationsByDate,
    CampaignAndDonationsPayload, Filter
} from "../../types/SelectDonationByDate"

const listCampaigns = async (duration: Filter): Promise<CampaignAndDonationsPayload[]> => {
    let middleDate: Date, startDate: Date | null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (duration) {
        case Filter.Daily:
            startDate = getTwoDaysAgo();
            middleDate = getOneDayAgo();
            break;
        case Filter.Weekly:
            startDate = getTwoWeekAgo();
            middleDate = getOneWeekAgo();
            break;
        case Filter.Monthly:
            startDate = getFirstDayOfLastMonth();
            middleDate = getFirstDayOfThisMonth();
            break;
        case Filter.Yearly:
            startDate = getFirstDayOfLastYear();
            middleDate = getFirstDayOfYear();
            break;
        case Filter.AllTime:
            startDate = null;
            middleDate = getFirstDayOfLastYear();
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
};

const getOneDayAgo = () => {
    const yesterdayDate: Date = new Date();
    yesterdayDate.setDate(new Date().getDate() - 1);
    return yesterdayDate;
}

const getTwoDaysAgo = () => {
    const date: Date = new Date();
    date.setDate(new Date().getDate() - 2);
    return date;
}

const getOneWeekAgo = () => {
    const lastWeekDate: Date = new Date();
    lastWeekDate.setDate(new Date().getDate() - 7);
    return lastWeekDate;
}

const getTwoWeekAgo = () => {
    const lastWeekDate: Date = new Date();
    lastWeekDate.setDate(new Date().getDate() - 14);
    return lastWeekDate;
}

const getFirstDayOfThisMonth = () => {
    const date = new Date();
    date.setDate(1);
    return date;
}

const getFirstDayOfLastMonth = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    return date;
}

const getFirstDayOfYear = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(0);
    return date;
}


const getFirstDayOfLastYear = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(date.getFullYear() - 1);
    return date;
}

export default {
    listCampaigns,
};
