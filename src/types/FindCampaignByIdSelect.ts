import { Prisma } from "@prisma/client";

export const findCampaignByIdSelect = {
  id: true,
  startDate: true,
  endDate: true,
  title: true,
  description: true,
  dollars: true,
  cents: true,
  imageUrl: true,
  donations: {
    select: {
      dollars: true,
      cents: true,
    },
  },
  donationAmounts: {
    select: {
      description: true,
      dollars: true,
      cents: true,
    },
  },
} satisfies Prisma.CampaignSelect;

export type FindCampaignByIdPayload = Prisma.CampaignGetPayload<{
  select: typeof findCampaignByIdSelect;
}>;
