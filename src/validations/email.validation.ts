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

export default {
  createEmailTemplate,
  findEmailTemplateById,
};
