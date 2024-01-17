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

type ExportDonationsParams = {
  campaignIds: string[],
  startDate: Date,
  endDate: Date
}

const exportDonations = async ({
  campaignIds,
  startDate,
  endDate
}: ExportDonationsParams): Promise<Array<Prisma.DonationGetPayload<{include: { campaign: true }}>>> => {
  // Filter the day's records
  if (startDate.getTime() === endDate.getTime()) {
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    endDate.setMilliseconds(999)
  }

  return prisma.donation.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      },
      OR: campaignIds.map(campaignId => ({campaignId}))
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      campaign: true
    }
  });
};

export default {
  listDonations,
  exportDonations
};
