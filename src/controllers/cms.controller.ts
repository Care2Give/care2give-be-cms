import clerkClient, { RequireAuthProp } from "@clerk/clerk-sdk-node";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import cmsService from "../services/cms.service";

const listCampaigns = catchAsync(async (req, res) => {
  const campaigns = await cmsService.listCampaigns();
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

export default {
  listCampaigns,
};
