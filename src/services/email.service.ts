import { Email } from "@prisma/client";
import prisma from "../client";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Create an email template
 * @param {Object} email - Email object
 * @returns {Promise<Email>}
 */
const createEmailTemplate = async (
  subject: string,
  content: string,
  editedBy: string
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
  return prisma.email.findMany();
};

/**
 * Find email template by id
 * @param {ObjectId} id
 * @returns {Promise<Email | null>}
 */
const findEmailTemplateById = async (
  emailId: string
): Promise<Email | null> => {
  return prisma.email.findUnique({
    where: { id: emailId },
  });
};

const getLatestEmailTemplate = async () => {
  const maxVersion = await prisma.email
    .aggregate({
      _max: {
        version: true,
      },
    })
    .then((res) => res._max.version);
  return maxVersion
    ? prisma.email.findFirst({
        where: {
          version: maxVersion,
        },
      })
    : null;
};

export default {
  createEmailTemplate,
  listEmailTemplates,
  findEmailTemplateById,
  getLatestEmailTemplate,
};
