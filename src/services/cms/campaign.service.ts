import { CampaignStatus, Prisma } from "@prisma/client";
import prisma from "../../client";
import {
  CmsCreateCampaignPayload,
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

const createCampaign = async (
  payload: Prisma.CampaignCreateInput
): Promise<CmsCreateCampaignPayload> => {
  return prisma.campaign.create({
    data: payload,
  });
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
  return prisma.campaign.update({
    where: {
      id,
    },
    data: payload,
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
  createCampaign,
  queryCampaign,
  updateCampaign,
  listArchivedCampaigns,
};
