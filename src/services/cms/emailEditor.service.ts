import httpStatus from "http-status";
import prisma from "../../client";
import ApiError from "../../utils/ApiError";
import { Email } from "@prisma/client";
import { transporter } from "../../aws/sesClient";
import logger from "../../config/logger";

/**
 * Get latest email
 * @returns {Promise<Email | null>}
 */
const getLatestEmail = async () => {
  return prisma.email.findFirst({
    orderBy: {
      version: "desc",
    },
  });
};

/**
 * Create an email template
 * @param {Object} email - Email object
 * @returns {Promise<Email>}
 */
const createEmail = async (
  editedBy: string,
  subject: string,
  content: string
): Promise<Email> => {
  if (!editedBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, "editedBy is required");
  }
  if (!subject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "subject is required");
  }
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "content is required");
  }
  return prisma.email.create({
    data: {
      editedBy,
      subject,
      content,
    },
  });
};

/**
 * List email templates
 * @returns {Promise<Email[]>}
 */
const listEmailTemplates = async (): Promise<Email[]> => {
  return prisma.email.findMany({
    orderBy: {
      version: "desc",
    },
  });
};

const sendEmail = async (
  recipients: string[],
  subject: string,
  content: string
) => {
  if (!recipients || recipients.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Recipients is required");
  }
  if (!subject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Subject is required");
  }
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Content is required");
  }

  transporter.sendMail(
    {
      from: process.env.SES_EMAIL_FROM || "care2givetech@outlook.sg",
      to: recipients,
      subject: subject,
      html: content,
    },
    (err, info) => {
      if (err) {
        logger.error(`Email failed to send: ${err.message}`);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
      } else {
        logger.info(`Email sent: ${info.messageId} ${info.response}`);
      }
    }
  );
};

export default {
  getLatestEmail,
  createEmail,
  listEmailTemplates,
  sendEmail,
};
