import { CampaignStatus } from "@prisma/client";
import prisma from "../client";
import {
  ListCampaignsPayload,
  listCampaignsSelect,
} from "../types/ListCampaignsSelect";
import {
  FindCampaignByIdPayload,
  findCampaignByIdSelect,
} from "../types/FindCampaignByIdSelect";

/**
 * List campaigns
 */
const listCampaigns = async (): Promise<ListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    where: {
      status: CampaignStatus.ACTIVE,
    },
    select: listCampaignsSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Find campaign by id
 * @param {ObjectId} id
 * @returns {Promise<Campaign>}
 */
const findCampaignById = async (
  id: string
): Promise<FindCampaignByIdPayload | null> => {
  return prisma.campaign.findUnique({
    where: { id, status: CampaignStatus.ACTIVE },
    select: findCampaignByIdSelect,
  });
};

export default {
  listCampaigns,
  findCampaignById,
};
