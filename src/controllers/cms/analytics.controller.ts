import catchAsync from "../../utils/catchAsync";
import cmsAnalyticsService from "../../services/cms/analytics.service";
import httpStatus from "http-status";
import { DurationFilter } from "../../types/DurationFilter";
import { DonationType } from "@prisma/client";
import { assert } from "console";

const listCampaigns = catchAsync(async (req, res) => {
    const { filter } = req.query;
    let middleDate: Date;
    let startDate: Date | null = null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (filter as DurationFilter) {
        case DurationFilter.Daily:
            startDate = getOneDayAgo(getOneDayAgo(new Date()));
            middleDate = getOneDayAgo(new Date());
            break;
        case DurationFilter.Weekly:
            startDate = getOneWeekAgo(getOneWeekAgo(new Date()));
            middleDate = getOneWeekAgo(new Date());
            break;
        case DurationFilter.Monthly:
            const firstDayOfMonth = getFirstDayOfThisMonth(new Date());
            firstDayOfMonth.setUTCMonth(firstDayOfMonth.getUTCMonth() - 1);
            startDate = getFirstDayOfThisMonth(firstDayOfMonth);
            middleDate = getFirstDayOfThisMonth(new Date());
            break;
        case DurationFilter.Yearly:
            const firstDayOfYear = getFirstDayOfYear(new Date());
            firstDayOfYear.setFullYear(firstDayOfYear.getUTCFullYear() - 1);
            startDate = getFirstDayOfYear(firstDayOfYear);
            middleDate = getFirstDayOfYear(new Date());
            break;
        case DurationFilter.AllTime:
            startDate = null;
            middleDate = getFirstDayOfYear(new Date());
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
            title: campaign.title,
            id: campaign.id,
            amount: currentAmount,
            trend: currentAmount > previousAmount
        })
    })
    res.status(httpStatus.OK).send(campaigns);
});

const getMostPopularAmounts = catchAsync(async (req, res) => {
    const { filter } = req.query;
    let startDate: Date | null;
    let endDate: Date = new Date();
    // TODO clarify exactly on how trends are calculated - especially when allTime is selected
    switch (filter as DurationFilter) {
        case DurationFilter.Daily:
            startDate = getOneDayAgo(new Date());
            break;
        case DurationFilter.Weekly:
            startDate = getOneWeekAgo(new Date());
            break;
        case DurationFilter.Monthly:
            startDate = getFirstDayOfThisMonth(new Date());
            break;
        case DurationFilter.Yearly:
            startDate = getFirstDayOfYear(new Date());
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

const getAllCampaignInformation = catchAsync(async (req, res) => {
    const { filter, startDate: startDateStr, endDate : endDateStr } = req.query;
    const startDate = new Date(startDateStr as string);
    const endDate = new Date(endDateStr as string);
    const campaignsWithDonations = await cmsAnalyticsService.listCampaignsWithDonations(startDate, endDate);

    const timeSeries = getTimeSeries(filter as DurationFilter, startDate, endDate);
    
    interface SeriesComponent {
        time: Date,
        value: number,
    }

    interface SeriesMap {
        id: string, 
        title: string, 
        series: SeriesComponent[]
    }

    const donationAmountsMap: SeriesMap[] = [];
    const numDonationsMap: SeriesMap[] = [];
    campaignsWithDonations.forEach(campaignWithDonation => {
        const donations = campaignWithDonation.donations; 
        const donationAmountSeries: SeriesComponent[] = [];
        const numDonationSeries: SeriesComponent[] = [];
        for (let timeSeriesIndex = 0; timeSeriesIndex < timeSeries.length - 1; timeSeriesIndex++) {
            const filteredDonations = donations.filter(donation => {
                const createdAtDate = new Date(donation.createdAt);
                return createdAtDate < timeSeries[timeSeriesIndex + 1] && createdAtDate >= timeSeries[timeSeriesIndex];
            })
            donationAmountSeries.push({
                time: timeSeries[timeSeriesIndex],
                value: filteredDonations.reduce((currentAmount, newDonation) => 
                currentAmount + newDonation.dollars + newDonation.cents / 100, 0)
            })
            numDonationSeries.push({
                time: timeSeries[timeSeriesIndex],
                value: filteredDonations.length, 
            })
        }

        const filteredDonations = donations.filter(donation => {
            const createdAtDate = new Date(donation.createdAt);
            return createdAtDate >= timeSeries[timeSeries.length - 1];
        })
        donationAmountSeries.push({
            time: timeSeries[timeSeries.length - 1],
            value: filteredDonations.reduce((currentAmount, newDonation) => 
            currentAmount + newDonation.dollars + newDonation.cents / 100, 0)
        })
        numDonationSeries.push({
            time: timeSeries[timeSeries.length - 1],
            value: filteredDonations.length, 
        })

        donationAmountsMap.push({
            id: campaignWithDonation.id, 
            title: campaignWithDonation.title, 
            series: donationAmountSeries
        })

        numDonationsMap.push({
            id: campaignWithDonation.id,
            title: campaignWithDonation.title, 
            series: numDonationSeries
        })
    })

    res.status(httpStatus.OK).send({
        donationAmount: donationAmountsMap,
        numDonations: numDonationsMap
    });
    
    // returns {donationAmount: [{campaign, series: [{time, amount}]}], donors: [{campaign, series: [{time, amount}]}]}
})

function getTimeSeries(duration: DurationFilter, startDate: Date, endDate: Date): Array<Date> {
    const timeSeries: Array<Date> = [];
    while (startDate < endDate) {
        timeSeries.push(startDate);
        switch (duration) {
            case DurationFilter.Daily:
                startDate = getOneDayAfter(startDate);
                break; 
            case DurationFilter.Weekly:
                startDate = getOneWeekAfter(startDate);
                break;
            case DurationFilter.Monthly:
                startDate = getFirstDayOfNextMonth(startDate); 
                break;
            default: 
                assert(false);
        }
    }
    return timeSeries;
}

const getOneDayAgo = (date: Date) => {
    const yesterdayDate: Date = new Date(date.getTime());
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    yesterdayDate.setUTCHours(0, 0, 0, 0);
    return yesterdayDate;
}

const getOneDayAfter = (date: Date) => {
    const tomorrowDate: Date = new Date(date.getTime());
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
    tomorrowDate.setUTCHours(0, 0, 0, 0);
    return tomorrowDate;
}

const getOneWeekAgo = (date: Date) => {
    const lastWeekDate: Date = new Date(date.getTime());
    lastWeekDate.setUTCDate(lastWeekDate.getUTCDate() - 7);
    lastWeekDate.setUTCHours(0, 0, 0, 0);
    return lastWeekDate;
}

const getOneWeekAfter = (date: Date) => {
    const nextWeekDate: Date = new Date(date.getTime());
    nextWeekDate.setUTCDate(nextWeekDate.getUTCDate() + 7);
    nextWeekDate.setUTCHours(0, 0, 0, 0);
    return nextWeekDate;
}

const getFirstDayOfThisMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getTime());
    firstDayOfMonth.setUTCDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    return firstDayOfMonth;
}

const getFirstDayOfNextMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getTime());
    firstDayOfMonth.setUTCMonth(firstDayOfMonth.getUTCMonth() + 1);
    firstDayOfMonth.setUTCDate(1);
    firstDayOfMonth.setUTCHours(0, 0, 0, 0);
    return firstDayOfMonth;
}

const getFirstDayOfYear = (date: Date) => {
    const firstDayOfYear = new Date(date.getTime());
    firstDayOfYear.setUTCDate(1);
    firstDayOfYear.setUTCMonth(0);
    firstDayOfYear.setUTCHours(0, 0, 0, 0);
    return firstDayOfYear;
}

export default {
    listCampaigns,
    getMostPopularAmounts,
    getCampaignInformation,
    getAllCampaignInformation
};

