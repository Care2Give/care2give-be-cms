import { Prisma } from "@prisma/client";

export const listCampaignsSelect = {
  id: true,
  startDate: true,
  endDate: true,
  title: true,
  dollars: true,
  cents: true,
  imageUrl: true,
  donations: {
    select: {
      dollars: true,
      cents: true,
    },
  },
} satisfies Prisma.CampaignSelect;

export type ListCampaignsPayload = Prisma.CampaignGetPayload<{
  select: typeof listCampaignsSelect;
}>;
