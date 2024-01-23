import Joi from "joi";

const createPaymentIntent = {
    body: Joi.object().keys({
        donationCartItems: Joi.array().items(Joi.object({
            campaignId: Joi.string().required(),
            dollars: Joi.number().required(),
            cents: Joi.number().required(),
        })).min(1).required(),
        donationType: Joi.string().valid(
            'ANONYMOUS', 
            'INDIVIDUAL_WITH_TAX_DEDUCTION', 
            'GROUP_WITH_TAX_DEDUCTION', 
            'WITHOUT_TAX_DEDUCTION').required(),
        donorFirstName: Joi.string().allow(null).required(),
        donorLastName: Joi.string().allow(null).required(),
        donorEmail: Joi.string().email().allow(null).required(),
        donorNricA: Joi.string().allow(null).required(),
        donorNricB: Joi.string().allow(null).required(),
        donorTrainingPrograms: Joi.array().items(Joi.string()).min(0).required(),
        currency: Joi.string().required(),
  }),
};

export default {
    createPaymentIntent,
};
