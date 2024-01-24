import express from "express";
import cmsCampaignController from "../../../controllers/cms/campaign.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";

const router = express.Router();

// Retrieves partial campaign details for display on data table
router.get("/", cmsCampaignController.listCampaigns);

// Retrieves partial ARCHIVED campaign details for display on data table
router.get("/archive", cmsCampaignController.listArchivedCampaigns);

// Requires full campaign details
router.post(
  "/",
  validate(campaignValidation.createCampaignAndDonationAmounts),
  cmsCampaignController.createCampaignAndDonationAmounts
);

router.post(
  "/images",
  upload.single("image"),
  cmsCampaignController.uploadSingleImage
);

// GET: Retrieves full campaign details
// UPDATE: Requires full campign details
router
  .route("/:id")
  .get(
    validate(campaignValidation.queryCampaignById),
    cmsCampaignController.queryCampaign
  )
  .patch(
    validate(campaignValidation.updateCampaignById),
    cmsCampaignController.updateCampaign
  );

export default router;
