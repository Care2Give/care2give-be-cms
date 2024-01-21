import express from "express";
import cmsCampaignController from "../../../controllers/cms/campaign.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";
import apiErrorHandler from "../../../middlewares/apiErrorHandler";
import multerErrorHandler from "../../../middlewares/multerErrorHandler";

const router = express.Router();

// Retrieves partial campaign details for display on data table
router.get("/", cmsCampaignController.listCampaigns);

// Requires full campaign details
router.post(
  "/",
  validate(campaignValidation.createCampaign),
  cmsCampaignController.createCampaign,
  apiErrorHandler
);

router.post(
  "/images",
  upload.single("image"),
  cmsCampaignController.uploadSingleImage,
  multerErrorHandler,
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
