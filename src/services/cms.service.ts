import { Email } from "@prisma/client";
import prisma from "../client";
import {
  CmsListCampaignsPayload,
  cmsListCampaignsSelect,
} from "../types/CmsListCampaignsSelect";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

const listCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    select: cmsListCampaignsSelect,
  });
};

const getLatestEmail = async () => {
  return prisma.email.findFirst({
    orderBy: {
      version: "desc",
    },
  });
};

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

export default {
  listCampaigns,
  getLatestEmail,
  createEmail,
};
