import clerkClient, { RequireAuthProp } from "@clerk/clerk-sdk-node";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import cmsCampaignService from "../../services/cms/campaign.service";
import s3 from "../../aws/s3Client";
import ApiError from "../../utils/ApiError";
import { FIVE_MEGABYTES } from "../../constants";

const listCampaigns = catchAsync(async (req, res) => {
  const campaigns = await cmsCampaignService.listCampaigns();
  const userId = campaigns.map((campaign) => campaign.editedBy);
  const users = await clerkClient.users.getUserList({
    userId,
  });
  const result = campaigns.map((campaign) => {
    return {
      ...campaign,
      userImageUrl: users.find((user) => user.id === campaign.editedBy)
        ?.imageUrl,
      firstName: users.find((user) => user.id === campaign.editedBy)?.firstName,
    };
  });
  res.status(httpStatus.OK).send(result);
});

//TODO: Ensure atomicity: in event of fail on Prisma, should not upload to S3, vice-versa
const createCampaign = catchAsync(async (req, res) => {
  const campaign = await cmsCampaignService.createCampaign(req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const queryCampaign = catchAsync(async (req, res) => {
  const campaign = await cmsCampaignService.queryCampaign(req.params.id);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  res.status(httpStatus.OK).send(campaign);
});

const updateCampaign = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campaign = await cmsCampaignService.updateCampaign(id, req.body);
  res.status(httpStatus.OK).send(campaign);
});

const uploadSingleImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, "File is required");
  }
  const key = await s3.sendToS3(req.file);
  res.status(httpStatus.CREATED).send({ key });
});

const getSingleImageSignedUrl = catchAsync(async (req, res) => {
  const key = req.params.key;
  try {
    await s3.checkValidKey(key);
    const signedUrl = await s3.getSignedUrlFromS3(key);
    res.status(httpStatus.OK).send({ url: signedUrl });
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Key does not exist");
  }
});

export default {
  listCampaigns,
  createCampaign,
  queryCampaign,
  updateCampaign,
  uploadSingleImage,
  getSingleImageSignedUrl,
};
