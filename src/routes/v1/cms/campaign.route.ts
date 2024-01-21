import express from "express";
import cmsCampaignController from "../../../controllers/cms/campaign.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";
import apiErrorHandler from "../../../middlewares/apiErrorHandler";

const router = express.Router();

// Retrieves partial campaign details for display on data table
router.get("/", cmsCampaignController.listCampaigns);

// Requires full campaign details
router.post(
  "/",
  upload.array("imageUrls"),
  validate(campaignValidation.createCampaign),
  cmsCampaignController.createCampaign,
  apiErrorHandler
);

// GET: Retrieves full campaign details
// UPDATE: Requires full campign details
router
  .route("/:id")
  .get(
    validate(campaignValidation.queryCampaignById),
    cmsCampaignController.queryCampaign,
    apiErrorHandler
  )
  .patch(
    validate(campaignValidation.updateCampaignById),
    cmsCampaignController.updateCampaign,
    apiErrorHandler
  );

export default router;
