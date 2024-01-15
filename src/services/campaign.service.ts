import { Campaign, CampaignStatus, Prisma } from "@prisma/client";
import prisma from "../client";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
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
      status: "ACTIVE",
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
    where: { id },
    select: findCampaignByIdSelect,
  });
};

export default {
  listCampaigns,
  findCampaignById,
};
