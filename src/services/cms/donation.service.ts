import { Prisma } from "@prisma/client";
import prisma from "../../client";
import {
  GetCampaignNamesPayload,
  getCampaignNamesSelect,
} from "../../types/GetCampaignNamesSelect";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";

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

const getCampaignNames = async (): Promise<GetCampaignNamesPayload[]> => {
  return prisma.campaign.findMany({
    select: getCampaignNamesSelect,
  });
};

type ExportDonationsParams = {
  campaignIds: string[];
  startDate: Date;
  endDate: Date;
};

const exportDonations = async ({
  campaignIds,
  startDate,
  endDate,
}: ExportDonationsParams): Promise<
  Array<Prisma.DonationGetPayload<{ include: { campaign: true } }>>
> => {
  if (startDate > endDate) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Start date is later than end date"
    );
  }
  // Filter the day's records
  if (startDate.getTime() === endDate.getTime()) {
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
  }

  return prisma.donation.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      OR: campaignIds.map((campaignId) => ({ campaignId })),
    },
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
  getCampaignNames,
  exportDonations,
};
