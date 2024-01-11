import clerkClient from "@clerk/clerk-sdk-node";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import cmsService from "../services/cms.service";
import ApiError from "../utils/ApiError";
import unescapeHtml from "../utils/unescapeHtml";

const listCampaigns = catchAsync(async (_, res) => {
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

const getLatestEmail = catchAsync(async (_, res) => {
  const latestEmail = await cmsService.getLatestEmail();
  const userId = latestEmail?.editedBy;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email not found");
  }
  const user = await clerkClient.users.getUser(userId);
  res.status(httpStatus.OK).send({ ...latestEmail, firstName: user.firstName });
});

const createEmail = catchAsync(async (req, res) => {
  // TODO: need to sanitise input
  const { editedBy, subject, content } = req.body;
  const email = await cmsService.createEmail(
    editedBy,
    unescapeHtml(subject),
    unescapeHtml(content)
  );
  res.status(httpStatus.CREATED).send(email);
});

const listEmailTemplates = catchAsync(async (req, res) => {
  const emails = await cmsService.listEmailTemplates();
  const userId = emails.map((email) => email.editedBy);
  const users = await clerkClient.users.getUserList({
    userId,
  });
  const result = emails.map((email) => {
    return {
      ...email,
      firstName: users.find((user) => user.id === email.editedBy)?.firstName,
    };
  });
  res.status(httpStatus.OK).send(result);
});

export default {
  listCampaigns,
  getLatestEmail,
  createEmail,
  listEmailTemplates,
};
