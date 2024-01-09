import prisma from "../client";
import {
  CmsListCampaignsPayload,
  cmsListCampaignsSelect,
} from "../types/CmsListCampaignsSelect";

const listCampaigns = async (): Promise<CmsListCampaignsPayload[]> => {
  return prisma.campaign.findMany({
    select: cmsListCampaignsSelect,
  });
};

export default {
  listCampaigns,
};
