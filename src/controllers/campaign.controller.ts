import httpStatus from "http-status";
import { campaignService, donationService } from "../services";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";

const createCampaign = catchAsync(async (req, res) => {
  const {
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
  } = req.body;
  const campaign = await campaignService.createCampaign(
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
    imageUrl
  );
  res.status(httpStatus.CREATED).send(campaign);
});

// All campaigns page
const listCampaigns = catchAsync(async (req, res) => {
  const campaignsWithDonations = await campaignService.listCampaigns();
  const result = campaignsWithDonations.map((campaign) => {
    const currentAmount = campaign.donations.reduce((acc, donation) => {
      return acc + donation.dollars + donation.cents / 100;
    }, 0);
    return {
      ...campaign,
      targetAmount: campaign.dollars + campaign.cents / 100,
      currentAmount,
      targetDate: new Date(campaign.endDate).getTime(),
    };
  });
  res.status(httpStatus.OK).send(result);
});

const findCampaignById = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await campaignService.findCampaignById(campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  const currentAmount = campaign.donations.reduce((acc, donation) => {
    return acc + donation.dollars + donation.cents / 100;
  }, 0);
  const donationAmounts = campaign.donationAmounts.map((donationAmount) => {
    return {
      ...donationAmount,
      value: donationAmount.dollars + donationAmount.cents / 100,
    };
  });
  res.status(httpStatus.OK).send({
    ...campaign,
    donors: campaign.donations.length,
    targetAmount: campaign.dollars + campaign.cents / 100,
    currentAmount,
    targetDate: new Date(campaign.endDate).getTime(),
    donationAmounts,
  });
});

const updateCampaignById = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await campaignService.updateCampaignById(
    campaignId,
    req.body
  );
  res.status(httpStatus.OK).send(campaign);
});

const deleteCampaignById = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  await campaignService.deleteCampaignById(campaignId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createCampaign,
  listCampaigns,
  findCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
