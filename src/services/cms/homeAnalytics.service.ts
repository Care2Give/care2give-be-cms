import moment from "moment";
import prisma from "../../client";
import {
  getFindCampaignDonationsByDate,
  CampaignAndDonationsPayload,
} from "../../types/SelectDonationByDate";
import createdAtFilter from "../../utils/createdAtFilter";

// const listCampaignsWithDonations = async (startDate: Date | null, endDate: Date): Promise<CampaignAndDonationsPayload[]> => {
//     return prisma.campaign.findMany({
//         select: getFindCampaignDonationsByDate(startDate, endDate),
//         orderBy: {
//             createdAt: "desc",
//         }
//     });;
// };

// const queryCampaign = async (id: string) => {
//     return prisma.campaign.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         donationAmounts: true,
//         donations: true,
//       },
//     });
//   };

// const getValidDonations = async (filter: string) => {
//   return (await cmsDonationService.listDonations()).filter((donation) => {
//     const currentTime = new Date().getTime();
//     const donationAge = new Date(donation.createdAt).getTime();
//     const diffInDays = Math.round(
//       (currentTime - donationAge) / (1000 * 60 * 60 * 24)
//     );

//     if (filter === "alltime") {
//       return donation;
//     } else if (filter === "yearly" && diffInDays <= 365) {
//       return donation;
//     } else if (filter === "monthly" && diffInDays <= 30) {
//       return donation;
//     } else if (filter === "weekly" && diffInDays <= 7) {
//       return donation;
//     } else if (filter === "daily" && diffInDays <= 1) {
//       return donation;
//     } else {
//       return;
//     }
//   });
// };

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

export default {
  totalDonationAmount,
  countDonors,
  highestDonationAmount,
};
