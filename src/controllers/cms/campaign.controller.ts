import clerkClient, { RequireAuthProp } from "@clerk/clerk-sdk-node";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import cmsCampaignService from "../../services/cms/campaign.service";
import s3 from "../../aws/s3Client";
import ApiError from "../../utils/ApiError";

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
  let data = req.body;
  if (req.files) {
    const imageUrl = await s3.sendManyToS3(req.files as Express.Multer.File[]);
    data = {
      ...data,
      imageUrl: imageUrl,
    };
  }
  const campaign = await cmsCampaignService.createCampaign(data);
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

export default {
  listCampaigns,
  createCampaign,
  queryCampaign,
  updateCampaign,
};
