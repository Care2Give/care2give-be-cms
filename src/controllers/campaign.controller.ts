import httpStatus from "http-status";
import { campaignService } from "../services";
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

const listCampaigns = catchAsync(async (req, res) => {
  const campaigns = await campaignService.listCampaigns();
  res.status(httpStatus.OK).send(campaigns);
});

const findCampaignById = catchAsync(async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await campaignService.findCampaignById(campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  res.status(httpStatus.OK).send(campaign);
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
