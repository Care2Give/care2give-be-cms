import Joi from "joi";

const createEmailTemplate = {
  body: Joi.object().keys({
    subject: Joi.string().required(),
    content: Joi.string().required(),
    editedBy: Joi.string().required(),
  }),
};

const findEmailTemplateById = {
  params: Joi.object().keys({
    emailId: Joi.string().required(),
  }),
};

const sendEmail = {
  body: Joi.object().keys({
    recipients: Joi.array().items(Joi.string().email()).required().min(1),
    subject: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

export default {
  createEmailTemplate,
  findEmailTemplateById,
  sendEmail,
};
