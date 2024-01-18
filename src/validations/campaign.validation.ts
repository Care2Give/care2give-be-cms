import Joi from "joi";

const findCampaignById = {
  params: Joi.object().keys({
    campaignId: Joi.string().required(),
  }),
};

export default {
  findCampaignById,
};
