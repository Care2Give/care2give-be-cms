import { Campaign, Prisma } from "@prisma/client";
import prisma from "../client";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Create a campaign
 * @param {Object} campaign - Campaign object
 * @returns {Promise<Campaign>}
 */
const createCampaign = async (
  status: string,
  startDate: Date,
  endDate: Date,
  title: string,
  description: string,
  currency: string,
  dollars: number,
  cents: number,
  createdBy: string,
  editedBy: string,
  imageUrl: string[]
): Promise<Campaign> => {
  return prisma.campaign.create({
    data: {
      status,
      startDate,
      endDate,
      title,
      description,
      currency,
      dollars,
      cents,
      createdBy,
      editedBy,
      imageUrl,
    },
  });
};

/**
 * List campaigns
 */
const listCampaigns = async (): Promise<Campaign[]> => {
  return prisma.campaign.findMany();
};

/**
 * Find campaign by id
 * @param {ObjectId} id
 * @returns {Promise<Campaign>}
 */
const findCampaignById = async (id: string): Promise<Campaign | null> => {
  return prisma.campaign.findUnique({ where: { id } });
};

/**
 * Update campaign by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Campaign>}
 */
const updateCampaignById = async (
  id: string,
  updateBody: Prisma.CampaignUpdateInput
): Promise<Campaign | null> => {
  const campaign = await findCampaignById(id);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  const updatedCampaign = await prisma.campaign.update({
    where: { id },
    data: updateBody,
  });
  return updatedCampaign;
};

/**
 * Delete campaign by id
 * @param {ObjectId} id
 * @returns {Promise<Campaign>}
 */
const deleteCampaignById = async (id: string): Promise<Campaign | null> => {
  const campaign = await findCampaignById(id);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  await prisma.campaign.delete({ where: { id } });
  return campaign;
};

export default {
  createCampaign,
  listCampaigns,
  findCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
