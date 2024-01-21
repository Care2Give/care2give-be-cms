import { Donation, Prisma } from "@prisma/client";
import prisma from "../client";

const createDonation = async (donation: Prisma.DonationCreateInput) => {
  return prisma.donation.create({
    data: donation,
  });
};

const listDonations = async (): Promise<Donation[]> => {
  return prisma.donation.findMany();
};

const queryDonations = async <Key extends keyof Donation>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  },
  keys: Key[] = [
    "id",
    "amount",
    "currency",
    "donorName",
    "donorEmail",
    "donorMessage",
    "campaignId",
    "createdAt",
    "updatedAt",
  ] as Key[]
): Promise<Pick<Donation, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? "desc";
  const donations = await prisma.donation.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined,
  });
  return donations as Pick<Donation, Key>[];
};

const findDonationById = async (id: string): Promise<Donation | null> => {
  return prisma.donation.findUnique({ where: { id } });
};

const updateDonation = async (
  id: string,
  updatedDonation: Prisma.DonationUpdateInput
): Promise<Donation | null> => {
  return prisma.donation.update({ where: { id: id }, data: updatedDonation });
};

export default {
  createDonation,
  listDonations,
  queryDonations,
  findDonationById,
  updateDonation,
};
