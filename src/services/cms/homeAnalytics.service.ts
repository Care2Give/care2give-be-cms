import prisma from "../../client";
import createdAtFilter from "../../utils/createdAtFilter";

const totalDonationAmount = async (filter: string) => {
  return prisma.donation.aggregate({
    where: {
      createdAt: createdAtFilter(filter),
    },
    _sum: {
      dollars: true,
    },
  });
};

const countDonors = async (filter: string) => {
  return prisma.donation.count({
    where: {
      createdAt: createdAtFilter(filter),
    },
  });
};

const highestDonationAmount = async (filter: string) => {
  return prisma.donation.aggregate({
    where: {
      createdAt: createdAtFilter(filter),
    },
    _max: {
      dollars: true,
    },
  });
};

const mostPopularCampaignID = async (filter: string) => {
  return prisma.donation.groupBy({
    where: {
      createdAt: createdAtFilter(filter),
    },
    by: ["campaignId"],
    _count: {
      campaignId: true,
    },
    orderBy: {
      _count: {
        campaignId: "desc",
      },
    },
  });
}

const mostPopularCampaignTitle = async (campaignId: string) => {  
  return prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
    select: {
      title: true,
    },
  });
}

const mostPopularAmount = async (filter: string) => {
  return prisma.campaignDonationAmount.groupBy({
    where: {
      createdAt: createdAtFilter(filter),
    },
    by: ["dollars"],
    _count: {
      dollars: true,
    },
    orderBy: {
      _count: {
        dollars: 'desc',
      },
    },
  });
}

const typesOfDonations = async () => {
  return prisma.donation.groupBy({
    by: ["donationType"],
    _count: {
      donationType: true,
    },
    orderBy: {
      _count: {
        donationType: "desc",
      },
    },
  });
}

const getDonationsBetweenDates = async (startDate: Date, endDate: Date) => {
  return prisma.donation.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export default {
  totalDonationAmount,
  countDonors,
  highestDonationAmount,
  mostPopularCampaignID,
  mostPopularCampaignTitle,
  mostPopularAmount,
  typesOfDonations,
  getDonationsBetweenDates
};
