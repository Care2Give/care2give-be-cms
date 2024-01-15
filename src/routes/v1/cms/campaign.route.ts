import express from "express";
import cmsCampaignController from "../../../controllers/cms/campaign.controller";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignValidation from "../../../validations/cms/campaign.validation";

const router = express.Router();

router.get("/", cmsCampaignController.listCampaigns);

router.post(
  "/",
  upload.array("imageUrl"),
  validate(campaignValidation.createCampaign),
  cmsCampaignController.createCampaign
);

router
  .route("/:id")
  .get(cmsCampaignController.queryCampaign)
  .patch(cmsCampaignController.updateCampaign);

export default router;
