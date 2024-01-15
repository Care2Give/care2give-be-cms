import express from "express";
import cmsAnalyticsController from "../../../controllers/cms/analytics.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";

const router = express.Router();

router.get("/campaigns", cmsAnalyticsController.listCampaigns);

export default router;
