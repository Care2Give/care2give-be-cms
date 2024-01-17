import clerkClient from "@clerk/clerk-sdk-node";
import httpStatus from "http-status";
import unescapeHtml from "../../utils/unescapeHtml";
import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import emailEditorService from "../../services/cms/emailEditor.service";

const getLatestEmail = catchAsync(async (_, res) => {
  const latestEmail = await emailEditorService.getLatestEmail();
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
  const email = await emailEditorService.createEmail(
    editedBy,
    unescapeHtml(subject),
    unescapeHtml(content)
  );
  res.status(httpStatus.CREATED).send(email);
});

const listEmailTemplates = catchAsync(async (req, res) => {
  const emails = await emailEditorService.listEmailTemplates();
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

const sendEmail = catchAsync(async (req, res) => {
  const { recipients, subject, content } = req.body;
  await emailEditorService.sendEmail(
    recipients,
    unescapeHtml(subject),
    unescapeHtml(content)
  );
  res.status(httpStatus.OK).send();
});

export default {
  getLatestEmail,
  createEmail,
  listEmailTemplates,
  sendEmail,
};
