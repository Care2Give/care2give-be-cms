import express from "express";
import cmsAnalyticsController from "../../../controllers/cms/analytics.controller";
import validate from "../../../middlewares/validate";
import analyticsValidation from "../../../validations/cms/analytics.validation";

const router = express.Router();

router.get("/campaigns", 
    validate(analyticsValidation.listCampaigns),
    cmsAnalyticsController.listCampaigns);

router.get("/most-popular-amounts", 
    validate(analyticsValidation.getMostPopularAmounts),
    cmsAnalyticsController.getMostPopularAmounts);

router.get("/detail-campaigns", 
    validate(analyticsValidation.getAllCampaignInformation),
    cmsAnalyticsController.getAllCampaignInformation);

router.get("/:campaignId", cmsAnalyticsController.getCampaignInformation);

export default router;
