import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import { emailService } from "../services";
import unescapeHtml from "../utils/unescapeHtml";

const createEmailTemplate = catchAsync(async (req, res) => {
  const { editedBy, subject, content } = req.body;
  const email = await emailService.createEmailTemplate(
    editedBy,
    unescapeHtml(subject),
    unescapeHtml(content)
  );
  res.status(httpStatus.CREATED).send(email);
});

const listEmailTemplates = catchAsync(async (req, res) => {
  const emails = await emailService.listEmailTemplates();
  res.status(httpStatus.OK).send(emails);
});

const findEmailTemplateById = catchAsync(async (req, res) => {
  const { emailId } = req.params;
  const email = await emailService.findEmailTemplateById(emailId);
  if (!email) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email not found");
  }
  res.status(httpStatus.OK).send(email);
});

const getLatestEmailTemplate = catchAsync(async (_, res) => {
  const latestEmail = await emailService.getLatestEmailTemplate();
  if (!latestEmail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email not found");
  }
  res.status(httpStatus.OK).send(latestEmail);
});

export default {
  createEmailTemplate,
  listEmailTemplates,
  findEmailTemplateById,
  getLatestEmailTemplate,
};
