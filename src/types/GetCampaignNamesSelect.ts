import { Prisma } from "@prisma/client";

export const getCampaignNamesSelect = {
  id: true,
  title: true,
} satisfies Prisma.CampaignSelect;

export type GetCampaignNamesPayload = Prisma.CampaignGetPayload<{
  select: typeof getCampaignNamesSelect;
}>;
