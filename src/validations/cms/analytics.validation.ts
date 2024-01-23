import Joi from "joi";
import { DurationFilter } from "../../types/DurationFilter";

const getMostPopularAmounts = {
    query: {
        filter: Joi.string()
            .valid(DurationFilter.AllTime, DurationFilter.Daily, DurationFilter.Monthly, 
                DurationFilter.Weekly, DurationFilter.Yearly).required()
    }
}

const getAllCampaignInformation = {
    query: {
        filter: Joi.string()
            .valid(DurationFilter.AllTime, DurationFilter.Daily, DurationFilter.Monthly, 
                DurationFilter.Weekly, DurationFilter.Yearly).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required()
    }
}

const listCampaigns = {
    query: {
        filter: Joi.string()
            .valid(DurationFilter.AllTime, DurationFilter.Daily, DurationFilter.Monthly, 
                DurationFilter.Weekly, DurationFilter.Yearly).required()
    }
}


export default {
    getMostPopularAmounts,
    getAllCampaignInformation,
    listCampaigns
}
