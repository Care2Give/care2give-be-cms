import express from "express";
import donationController from "../../../controllers/cms/donation.controller";
import validate from "../../../middlewares/validate";
import donationValidation from "../../../validations/cms/donation.validation";
import errorHandler from "../../../middlewares/errorHandler";

const router = express.Router();

router.get("/", donationController.listDonations, errorHandler);
router.get("/campaigns", donationController.getCampaignNames, errorHandler);

router.post(
  "/export",
  validate(donationValidation.exportDonations),
  donationController.exportDonationsToXlsx,
  errorHandler
);

router.post(
  "/list-export",
  validate(donationValidation.exportDonations),
  donationController.listExportedDonations,
  errorHandler
);

export default router;
