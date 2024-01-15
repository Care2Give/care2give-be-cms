import Joi from "joi";

const exportDonations = {
  body: Joi.object().keys({
    campaignIds: Joi.array().items(Joi.string()),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required()
  }),
};

export default {
  exportDonations
};
