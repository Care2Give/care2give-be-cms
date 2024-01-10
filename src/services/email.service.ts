import { Email } from "@prisma/client";
import prisma from "../client";

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
  return prisma.email.create({
    data: {
      subject,
      content,
      editedBy,
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

export default {
  createEmailTemplate,
  listEmailTemplates,
  findEmailTemplateById,
};
