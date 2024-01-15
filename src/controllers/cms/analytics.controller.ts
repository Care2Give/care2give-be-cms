import catchAsync from "../../utils/catchAsync";
import cmsAnalyticsService from "../../services/cms/analytics.service";
import clerkClient from "@clerk/clerk-sdk-node";
import httpStatus from "http-status";

const listCampaigns = catchAsync(async (req, res) => {
    const { filter } = req.body;
    const campaigns = await cmsAnalyticsService.listCampaigns(filter);
    res.status(httpStatus.OK).send(campaigns);
});

export default {
    listCampaigns,
};

