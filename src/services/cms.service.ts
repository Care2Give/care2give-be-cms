import { Email } from "@prisma/client";
import prisma from "../client";
import {
  CmsListCampaignsPayload,
  cmsListCampaignsSelect,
} from "../types/CmsListCampaignsSelect";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const listDonations = async () => {
  return prisma.donation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * List campaigns
 * @returns {Promise<CmsListCampaignsPayload[]>}
 */
const listCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    select: cmsListCampaignsSelect,
  });
};

/**
 * Get latest email
 * @returns {Promise<Email | null>}
 */
const getLatestEmail = async () => {
  return prisma.email.findFirst({
    orderBy: {
      version: "desc",
    },
  });
};

/**
 * Create an email template
 * @param {Object} email - Email object
 * @returns {Promise<Email>}
 */
const createEmail = async (
  editedBy: string,
  subject: string,
  content: string
): Promise<Email> => {
  if (!editedBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "editedBy is required");
  }
  if (!subject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "subject is required");
  }
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "content is required");
  }
  return prisma.email.create({
    data: {
      editedBy,
      subject,
      content,
    },
  });
};

/**
 * List email templates
 * @returns {Promise<Email[]>}
 */
const listEmailTemplates = async (): Promise<Email[]> => {
  return prisma.email.findMany({
    orderBy: {
      version: "desc",
    },
  });
};

export default {
  listDonations,
  listCampaigns,
  getLatestEmail,
  createEmail,
  listEmailTemplates,
};
