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

export default {
  totalDonationAmount,
  countDonors,
  highestDonationAmount,
};
