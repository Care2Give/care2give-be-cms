import { Prisma } from "@prisma/client";
import prisma from "../../client";
import {
  CmsCreateCampaignPayload,
  CmsListCampaignsPayload,
  cmsListCampaignsSelect,
} from "../../types/cms.types";

const listCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
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

export default {
  listCampaigns,
  createCampaign,
};
