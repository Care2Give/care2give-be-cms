import { CampaignStatus, Prisma } from "@prisma/client";
import prisma from "../../client";
import {
  CmsListCampaignsPayload,
  cmsListCampaignsSelect,
} from "../../types/cms.types";

const listCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    where: {
      OR: [
        {
          status: CampaignStatus.ACTIVE,
        },
        {
          status: CampaignStatus.INACTIVE,
        },
      ],
    },
    select: cmsListCampaignsSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createCampaignAndDonationAmounts = async (
  payload: Prisma.CampaignCreateInput
) => {
  const donationAmounts = payload.donationAmounts;
  delete payload.donationAmounts;
  const campaign = await prisma.campaign.create({
    data: {
      ...payload,
      donationAmounts: {
        create: donationAmounts,
      },
    },
  });
  return await queryCampaign(campaign.id);
};

const queryCampaign = async (id: string) => {
  return prisma.campaign.findUnique({
    where: {
      id,
    },
    include: {
      donationAmounts: true,
    },
  });
};

const updateCampaign = async (
  id: string,
  payload: Prisma.CampaignUpdateInput
) => {
  const donationAmounts = payload.donationAmounts;
  delete payload.donationAmounts;
  return prisma.campaign.update({
    where: {
      id,
    },
    data: {
      ...payload,
      donationAmounts: {
        deleteMany: {
          campaignId: id,
        },
        create: donationAmounts,
      },
    },
  });
};

const listArchivedCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    where: {
      status: CampaignStatus.ARCHIVED,
    },
    select: cmsListCampaignsSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default {
  listCampaigns,
  createCampaignAndDonationAmounts,
  queryCampaign,
  updateCampaign,
  listArchivedCampaigns,
};
