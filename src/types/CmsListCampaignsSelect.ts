import { Prisma } from "@prisma/client";

export const cmsListCampaignsSelect = {
  id: true,
  startDate: true,
  endDate: true,
  title: true,
  editedBy: true,
  status: true,
} satisfies Prisma.CampaignSelect;

export type CmsListCampaignsPayload = Prisma.CampaignGetPayload<{
  select: typeof cmsListCampaignsSelect;
}>;
