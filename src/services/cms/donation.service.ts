import { Prisma } from "@prisma/client";
import prisma from "../../client";

const listDonations = async (): Promise<
  Array<Prisma.DonationGetPayload<{ include: { campaign: true } }>>
> => {
  return prisma.donation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      campaign: true,
    },
  });
};

export default {
  listDonations,
};
