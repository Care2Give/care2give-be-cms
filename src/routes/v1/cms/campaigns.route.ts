import express from "express";
import { cmsCampaignsController } from "../../../controllers";
import { upload } from "../../../middlewares/multer";
import validate from "../../../middlewares/validate";
import campaignsValidation from "../../../validations/cms/campaigns.validation";

const router = express.Router();

router.get("/", cmsCampaignsController.listCampaigns);

router.post(
  "/",
  upload.array("imageUrl"),
  validate(campaignsValidation.createCampaign),
  cmsCampaignsController.createCampaign
);

export default router;
