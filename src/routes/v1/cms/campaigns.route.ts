import express from "express";
import { cmsCampaignsController } from "../../../controllers";
import { upload } from "../../../middlewares/multer";

const router = express.Router();

router.get("/", cmsCampaignsController.listCampaigns);

router.post(
  "/",
  upload.array("imageUrl"),
  cmsCampaignsController.createCampaign
);

export default router;
