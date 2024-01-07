import Joi from "joi";

const createCampaign = {
  body: Joi.object().keys({
    status: Joi.string(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    currency: Joi.string().required(),
    dollars: Joi.number().required(),
    cents: Joi.number().required(),
    createdBy: Joi.string().required(),
    editedBy: Joi.string().required(),
    imageUrl: Joi.array().items(Joi.string()),
  }),
};

export default { createCampaign };
