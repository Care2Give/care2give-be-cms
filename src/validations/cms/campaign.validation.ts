import Joi from "joi";

const createCampaignAndDonationAmounts = {
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
    imageUrls: Joi.array().items(Joi.string()).required(),
    donationAmounts: Joi.array().items(
      Joi.object().keys({
        dollars: Joi.number().required(),
        cents: Joi.number().required(),
        description: Joi.string(),
      })
    ),
  }),
};

const queryCampaignById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateCampaignById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      title: Joi.string().required(),
      description: Joi.string(),
      currency: Joi.string().required(),
      dollars: Joi.number().required(),
      cents: Joi.number().required(),
      createdBy: Joi.string(),
      editedBy: Joi.string().required(),
      imageUrls: Joi.array().items(Joi.string()).required(),
      donationAmounts: Joi.array().items(
        Joi.object().keys({
          id: Joi.string(),
          dollars: Joi.number().required(),
          cents: Joi.number().required(),
          description: Joi.string(),
        })
      ),
    })
    .min(1),
};

const uploadSingleImage = {
  body: Joi.object().keys({
    image: Joi.binary().required(),
  }),
};

export default {
  createCampaignAndDonationAmounts,
  queryCampaignById,
  updateCampaignById,
  uploadSingleImage,
};
