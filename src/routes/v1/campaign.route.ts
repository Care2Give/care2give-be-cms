import express from "express";
import validate from "../../middlewares/validate";
import { campaignValidation } from "../../validations";
import { campaignController } from "../../controllers";

const router = express.Router();

router.post(
  "/create",
  validate(campaignValidation.createCampaign),
  campaignController.createCampaign
);

router.get("/list", campaignController.listCampaigns);

router
  .route("/:campaignId")
  .get(campaignController.findCampaignById)
  .patch(campaignController.updateCampaignById)
  .delete(campaignController.deleteCampaignById);

export default router;
