import express from "express";
import cmsAnalyticsController from "../../../controllers/cms/analytics.controller";

const router = express.Router();

router.get("/campaigns", cmsAnalyticsController.listCampaigns);

router.get("/most-popular-amounts", cmsAnalyticsController.getMostPopularAmounts);

router.get("/detail-campaigns", cmsAnalyticsController.getAllCampaignInformation);

router.get("/:campaignId", cmsAnalyticsController.getCampaignInformation);

export default router;
