import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import homeAnalyticsService from "../../services/cms/homeAnalytics.service";

// gets the total donations across all campaigns
const totalDonationAmount = catchAsync(async (req, res) => {
  const { filter } = req.query;
  const donation = await homeAnalyticsService.totalDonationAmount(
    filter as string
  );
  const totalAmount = donation?._sum?.dollars || 0;

  res.status(httpStatus.OK).send({ totalAmount });
});

// gets the total number of donations across all campaigns
const totalDonorNumber = catchAsync(async (req, res) => {
  const { filter } = req.query;
  const donorNumber = await homeAnalyticsService.countDonors(filter as string);
  res.status(httpStatus.OK).send({ donorNumber });
});

// gets the highest amount donated in a single donation across all campaigns
const highestDonationAmount = catchAsync(async (req, res) => {
  const { filter } = req.query;
  const donation = await homeAnalyticsService.highestDonationAmount(
    filter as string
  );
  const highestAmount = donation?._max?.dollars || 0;

  res.status(httpStatus.OK).send({ highestAmount });
});

// gets the most popular campaign by the number of donors
// takes in a parameter to specify how to search by (daily, weekly, monthly, yearly, all time)
const mostPopularCampaign = catchAsync(async (req, res) => {
  const { filter } = req.query;

  // filters for the donations according to the time parameter
  const campaignID = await homeAnalyticsService.mostPopularCampaignID(filter as string);

  const campaignTitle = await homeAnalyticsService.mostPopularCampaignTitle(campaignID[0].campaignId);

  res.status(httpStatus.OK).send({
    campaignTitle: campaignTitle?.title || "",
    numberOfDonors: campaignID[0]?._count?.campaignId || 0,
  });
});

// gets the most popular amount donated across all campaigns
// takes in a parameter to specify how to sort by (daily, weekly, monthly)
const mostPopularAmount = catchAsync(async (req, res) => {
  const { filter } = req.query;

  // filters for the donations according to the time parameter
  const mostPopularAmount = await homeAnalyticsService.mostPopularAmount(filter as string);

  res.status(httpStatus.OK).send({
    mostPopularAmount: mostPopularAmount[0]?.dollars || 0,
    numberOfDonors: mostPopularAmount[0]?._count?.dollars || 0,
  });
});

// gets the number of each type of donation
const typesOfDonations = catchAsync(async (_, res) => {
  const types = await homeAnalyticsService.typesOfDonations();

  const typeOfDonationsMap = new Map<string, number>();

  types.forEach((type) => {
    typeOfDonationsMap.set(type.donationType, type._count.donationType);
  });

  res
    .status(httpStatus.OK)
    .send(JSON.stringify(Object.fromEntries(typeOfDonationsMap)));
});

// gets the total number of donations each day
// takes in 2 dates (start and end dates) to filter the data by
const dailyDonations = catchAsync(async (req, res) => {
  const { first, second } = req.query;

  const firstDate = new Date(first as string);
  const secondDate = new Date(second as string);

  // filters for the donations according to the time parameter
  const donations = await homeAnalyticsService.getDonationsBetweenDates(firstDate, secondDate);

  const dateMap = new Map<string, number>();

  // count the number of donation amounts across all campaigns
  donations.forEach((donation) => {
    const donationDate = donation.createdAt.toISOString().slice(0, 10);
    const donationAmount = donation.dollars + donation.cents / 100;
    if (dateMap.has(donationDate)) {
      const currentVal = dateMap.get(donationDate);
      if (currentVal !== undefined) {
        dateMap.set(donationDate, currentVal + donationAmount);
      } else {
        throw new Error("Amount is undefined");
      }
    } else {
      dateMap.set(donationDate, donationAmount);
    }
  });

  res.status(httpStatus.OK).send(JSON.stringify(Object.fromEntries(dateMap)));
});

export default {
  totalDonationAmount,
  totalDonorNumber,
  highestDonationAmount,
  mostPopularCampaign,
  mostPopularAmount,
  typesOfDonations,
  dailyDonations,
};
