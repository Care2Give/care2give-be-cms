import catchAsync from "../../utils/catchAsync";
import cmsAnalyticsService from "../../services/cms/analytics.service";
import clerkClient from "@clerk/clerk-sdk-node";
import httpStatus from "http-status";
import { DurationFilter } from "../../types/DurationFilter";
import { DonationType } from "@prisma/client";

const listCampaigns = catchAsync(async (req, res) => {
    const { filter } = req.body;
    let middleDate: Date;
    let startDate: Date | null = null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (filter as DurationFilter) {
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

    const campaignWithDonations = await cmsAnalyticsService.listCampaignsWithDonations(startDate, endDate);

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
    let startDate: Date | null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (filter as DurationFilter) {
        case DurationFilter.Daily:
            startDate = getOneDayAgo();
            break;
        case DurationFilter.Weekly:
            startDate = getOneWeekAgo();
            break;
        case DurationFilter.Monthly:
            startDate = getFirstDayOfThisMonth();
            break;
        case DurationFilter.Yearly:
            startDate = getFirstDayOfYear();
            break;
        case DurationFilter.AllTime:
            startDate = null;
            break;
    }

    const campaignsWithDonations = await cmsAnalyticsService.listCampaignsWithDonations(startDate, endDate);

    interface DonationAmountByCampaign {
        campaign: string,
        amount: number,
        numberOfDonations: number,
    }

    const amounts: DonationAmountByCampaign[] = [];
    campaignsWithDonations.forEach(campaignWithDonation => {
        const amountMap = new Map<number, number>();
        campaignWithDonation.donations.forEach(donation => {
            const donationAmount = donation.dollars + donation.cents / 100;
            if (amountMap.has(donationAmount)) {
              const currentVal = amountMap.get(donationAmount)
              if (currentVal !== undefined) {
                amountMap.set(donationAmount, currentVal + 1)
              } else {
                throw new Error('Amount is undefined');
              }
            } else {
              amountMap.set(donationAmount, 1)
            }
        })
        
        amountMap.forEach((numDonations, donationAmount) => {
            amounts.push({
                campaign: campaignWithDonation.title,
                amount: donationAmount,
                numberOfDonations: numDonations
            })
        })
    }) 
    amounts.sort((amount1, amount2) => amount2.numberOfDonations - amount1.numberOfDonations);
    res.status(httpStatus.OK).send(amounts);
})

const getCampaignInformation = catchAsync(async (req, res) => {
    const { campaignId } = req.params;
    const campaign = await cmsAnalyticsService.queryCampaign(campaignId);
    if (campaign === null) {
        res.status(httpStatus.NOT_FOUND);
        return;
    }
    const donationTypeMap = new Map<DonationType, number>();
    const donationAmountMap = new Map<number, number>();
    campaign.donations.forEach(donation => {
        if (donationTypeMap.has(donation.donationType)) {
            const oldCount = donationTypeMap.get(donation.donationType) as number;
            donationTypeMap.set(donation.donationType, oldCount + 1);
        } else {
            donationTypeMap.set(donation.donationType, 1);
        }
        const donationAmount = donation.dollars + donation.cents / 100;
        if (donationAmountMap.has(donationAmount)) {
            const oldCount = donationAmountMap.get(donationAmount) as number; 
            donationAmountMap.set(donationAmount, oldCount + 1);
        } else {
            donationAmountMap.set(donationAmount, 1);
        }
    });

    const campaignInformation = {
        title: campaign.title,
        currentAmount: campaign.donations
            .reduce((total, newDonation) => total + newDonation.dollars + newDonation.cents / 100, 0),
        highestDonation: campaign.donations.reduce((highestDonation, newDonation) => 
            newDonation.dollars + newDonation.cents / 100 > highestDonation.dollars + highestDonation.cents / 100
                ? newDonation
                : highestDonation
            ),
        startDate: campaign.startDate, 
        endDate: campaign.endDate, 
        timeLeft: campaign.endDate.getUTCMilliseconds() - new Date().getUTCMilliseconds(),
        donationTypeMap: JSON.stringify(Object.fromEntries(donationTypeMap)), 
        donationAmountMap: JSON.stringify(Object.fromEntries(donationAmountMap)),
    }
    res.status(httpStatus.OK).send(campaignInformation);
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
    getMostPopularAmounts,
    getCampaignInformation
};

