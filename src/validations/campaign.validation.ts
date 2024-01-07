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

const findCampaignById = {
  params: Joi.object().keys({
    campaignId: Joi.string().required(),
  }),
};

const updateCampaignById = {
  params: Joi.object().keys({
    campaignId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      title: Joi.string(),
      description: Joi.string(),
      currency: Joi.string(),
      dollars: Joi.number(),
      cents: Joi.number(),
      createdBy: Joi.string(),
      editedBy: Joi.string(),
      imageUrl: Joi.array().items(Joi.string()),
    })
    .min(1),
};

const deleteCampaignById = {
  params: Joi.object().keys({
    campaignId: Joi.string().required(),
  }),
};

export default {
  createCampaign,
  findCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
