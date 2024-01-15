import catchAsync from "../../utils/catchAsync";
import cmsAnalyticsService from "../../services/cms/analytics.service";
import clerkClient from "@clerk/clerk-sdk-node";
import httpStatus from "http-status";

const listCampaigns = catchAsync(async (req, res) => {
    const { filter: DurationFilter } = req.body;
    let middleDate: Date;
    let startDate: Date | null = null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (filter) {
        case DurationFilter.Daily:
            startDate = getTwoDaysAgo();
            middleDate = getOneDayAgo();
            break;
        case DurationFilter.Weekly:
            startDate = getTwoWeekAgo();
            middleDate = getOneWeekAgo();
            break;
        case DurationFilter.Monthly:
            startDate = getFirstDayOfLastMonth();
            middleDate = getFirstDayOfThisMonth();
            break;
        case DurationFilter.Yearly:
            startDate = getFirstDayOfLastYear();
            middleDate = getFirstDayOfYear();
            break;
        case DurationFilter.AllTime:
            startDate = null;
            middleDate = getFirstDayOfLastYear();
            break;
    }

    const campaignWithDonations = await cmsAnalyticsService.listCampaigns(startDate, endDate);

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
    res.status(httpStatus.OK).send(campaigns);
});

const getMostPopularAmounts = catchAsync(async (req, res) => {
    const { filter } = req.body;
    const mostPopularAmounts = await cmsAnalyticsService.getMostPopularAmounts(filter);
    res.status(httpStatus.OK).send(mostPopularAmounts);
})

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

