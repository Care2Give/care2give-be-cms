import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import { emailService } from "../services";

const createEmailTemplate = catchAsync(async (req, res) => {
  const { subject, content, editedBy } = req.body;
  const email = await emailService.createEmailTemplate(
    subject,
    content,
    editedBy
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

export default {
  createEmailTemplate,
  listEmailTemplates,
  findEmailTemplateById,
};
