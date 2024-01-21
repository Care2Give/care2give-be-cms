import express from "express";
import cmsCampaignController from "../../../controllers/cms/campaign.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";
import errorHandler from "../../../middlewares/errorHandler";

const router = express.Router();

// Retrieves partial campaign details for display on data table
router.get("/", cmsCampaignController.listCampaigns, errorHandler);

// Requires full campaign details
router.post(
  "/",
  validate(campaignValidation.createCampaign),
  cmsCampaignController.createCampaign,
  errorHandler
);

router.post(
  "/images",
  upload.single("image"),
  cmsCampaignController.uploadSingleImage,
  errorHandler
);

router.get(
  "/images/:key",
  validate(campaignValidation.getSingleImageSignedUrl),
  cmsCampaignController.getSingleImageSignedUrl,
  errorHandler
);

// GET: Retrieves full campaign details
// UPDATE: Requires full campign details
router
  .route("/:id")
  .get(
    validate(campaignValidation.queryCampaignById),
    cmsCampaignController.queryCampaign,
    errorHandler
  )
  .patch(
    validate(campaignValidation.updateCampaignById),
    cmsCampaignController.updateCampaign,
    errorHandler
  );

export default router;
