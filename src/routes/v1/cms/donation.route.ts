import express from "express";
import donationController from "../../../controllers/cms/donation.controller";
import validate from "../../../middlewares/validate";
import donationValidation from "../../../validations/cms/donation.validation";

const router = express.Router();

router.get("/", donationController.listDonations);
router.get("/campaigns", donationController.getCampaignNames);

router.post(
  "/export",
  validate(donationValidation.exportDonations),
  donationController.exportDonationsToXlsx
);

router.post(
  "/list-export",
  validate(donationValidation.exportDonations),
  donationController.listExportedDonations
);

export default router;
