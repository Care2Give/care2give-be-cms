import { Prisma } from "@prisma/client";
import {bool, boolean} from "joi";

export enum Filter {
  Daily= "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
  AllTime = "allTime",
}

interface CampaignDonationSelect {
  id: boolean,
  title: boolean,
  donations: {
    where: {
      createdAt: {
        gte?: Date,
        lte?: Date,
      }
    },
    select: {
      dollars: boolean,
      cents: boolean,
      createdAt: boolean
    }
  }
}

const CampaignDonation: CampaignDonationSelect = {
  id: true,
  title: true,
  donations: {
    where: {
      createdAt: {
      }
    },
    select: {
      dollars: true,
      cents: true,
      createdAt: true
    },
  },
} satisfies Prisma.CampaignSelect

export function getFindCampaignDonationsByDate(startDate: Date | null, endDate: Date): Prisma.CampaignSelect {
  CampaignDonation.donations.where.createdAt.lte = endDate;
  if (startDate !== null) {
    CampaignDonation.donations.where.createdAt.gte = startDate;
  }
  return CampaignDonation;
}

export type CampaignAndDonationsPayload = Prisma.CampaignGetPayload<{
  select: typeof CampaignDonation;
}>;
