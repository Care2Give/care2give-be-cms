import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { campaignService } from "../../services";
import cmsDonationService from "../../services/cms/donation.service";
import { $Enums } from "@prisma/client";


// gets the total donations across all campaigns
const totalDonationAmount = catchAsync(async (_, res) => {
  const campaignsWithDonations = await campaignService.listCampaigns();
  const totalAmount = campaignsWithDonations.map((campaign) => {
    const currentAmount = campaign.donations.reduce((acc, donation) => {
      return acc + donation.dollars + donation.cents / 100;
    }, 0);
    return currentAmount
  }).reduce((sum, current) => sum + current, 0);

  res.status(httpStatus.OK).send({totalAmount});
});

// gets the total number of donations across all campaigns
const totalDonorNumber = catchAsync(async (_, res) => {
  const campaignsWithDonations = await campaignService.listCampaigns();
  const totalDonors = campaignsWithDonations.map(campaign => {
    return campaign.donations;
  }).length;

  res.status(httpStatus.OK).send({totalDonors});
});

// gets the highest amount donated in a single donation across all campaigns
const highestDonationAmount = catchAsync(async (_, res) => {
  const campaignsWithDonations = await campaignService.listCampaigns();
  const highestAmount = campaignsWithDonations.map((campaign) => {
    const currentAmount = campaign.donations.reduce((acc, donation) => {
      return acc + donation.dollars + donation.cents / 100;
    }, 0);
    return currentAmount
  }).reduce((prev, current) => {
    return (prev && prev > current) ? prev : current
  });

  res.status(httpStatus.OK).send({highestAmount});
});

// helper function to filter the donations by time
const getValidDonations = async (filter: string) => {
  return (await cmsDonationService.listDonations()).filter(
    donation => {
      const currentTime = new Date().getTime()
      const donationAge = new Date(donation.createdAt).getTime()
      const diffInDays = Math.round((currentTime-donationAge) / (1000*60*60*24))

      if (filter == "all-time") {
        return donation;
      } else if (filter == "yearly" && diffInDays <= 365) {
        return donation
      } else if (filter == "yearly" && diffInDays <= 30) {
        return donation
      } else if (filter == "weekly" && diffInDays <= 7) {
        return donation
      } else if (filter == "daily" && diffInDays <= 1) {
        return donation
      } else {
        return
      }
    }
  );
}

// gets the most popular campaign by the number of donors 
// takes in a parameter to specify how to search by (daily, weekly, monthly, yearly, all time)
const mostPopularCampaign = catchAsync(async (req, res) => {
  const { filter } = req.body

  // filters for the donations according to the time parameter
  const donations = await getValidDonations(filter)

  if (donations.length == 0) {
    throw new Error ("no donations have been made" + filter)
  }

  const campaignMap = new Map<string, number>();

  // count the number of donations for each campaign
  donations.forEach(donation => {
    if (campaignMap.has(donation.campaign.id)) {
      const currentVal = campaignMap.get(donation.campaign.id)
      if (currentVal !== undefined) {
        campaignMap.set(donation.campaign.id, currentVal + 1)
      } else {
        throw new Error('Title is undefined');
      }
    } else {
      campaignMap.set(donation.campaign.id, 1)
    }
  })
  
  const mostPopularCampaign = [...campaignMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)

  // get the campaign with the highest number of donations
  const campaignTitle = donations.find(donation => {
    return donation.campaign.id == mostPopularCampaign[0]
  })?.campaign.title

  res.status(httpStatus.OK).send(campaignTitle);
});

// gets the most popular amount donated across all campaigns
// takes in a parameter to specify how to sort by (daily, weekly, monthly)
const mostPopularAmount = catchAsync(async (req, res) => {
  const { filter } = req.body

  // filters for the donations according to the time parameter
  const donations = await getValidDonations(filter)

  if (donations.length == 0) {
    throw new Error ("no donations have been made" + filter)
  }

  const amountMap = new Map<number, number>();

  // count the number of donation amounts across all campaigns
  donations.forEach(donation => {
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
  
  const mostPopularAmount = [...amountMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)

  res.status(httpStatus.OK).send(mostPopularAmount[0].toString());
});

// gets the number of each type of donation
const typesOfDonations = catchAsync(async (_, res) => {
  const donations = await cmsDonationService.listDonations()

  const typeOfDonationsMap = new Map<$Enums.DonationType, number>();

  // count the number of donation amounts across all campaigns
  donations.forEach(donation => {
    if (typeOfDonationsMap.has(donation.donationType)) {
      const currentVal = typeOfDonationsMap.get(donation.donationType)
      if (currentVal !== undefined) {
        typeOfDonationsMap.set(donation.donationType, currentVal + 1)
      } else {
        throw new Error('Amount is undefined');
      }
    } else {
      typeOfDonationsMap.set(donation.donationType, 1)
    }
  })
  
  res.status(httpStatus.OK).send(JSON.stringify(Object.fromEntries(typeOfDonationsMap)));
});

// gets the total number of donations each day
// takes in 2 dates (start and end dates) to filter the data by
const dailyDonations = catchAsync(async (req, res) => {
  const { first, second } = req.body

  const firstDate = new Date(first)
  const secondDate = new Date(second)

  // filters for the donations according to the time parameter
  const donations = (await cmsDonationService.listDonations()).filter(
    donation => {
      return donation.createdAt > firstDate && donation.createdAt < secondDate
    }
  )

  const dateMap = new Map<string, number>();

  // count the number of donation amounts across all campaigns
  donations.forEach(donation => {
    const donationDate = donation.createdAt.toISOString().slice(0, 10)
    const donationAmount = donation.dollars + donation.cents / 100;
    if (dateMap.has(donationDate)) {
      const currentVal = dateMap.get(donationDate)
      if (currentVal !== undefined) {
        dateMap.set(donationDate, currentVal + donationAmount)
      } else {
        throw new Error('Amount is undefined');
      }
    } else {
      dateMap.set(donationDate, donationAmount)
    }
  })
  
  res.status(httpStatus.OK).send(JSON.stringify(Object.fromEntries(dateMap)));
});


export default {
  totalDonationAmount,
  totalDonorNumber,
  highestDonationAmount,
  mostPopularCampaign,
  mostPopularAmount,
  typesOfDonations,
  dailyDonations
};
