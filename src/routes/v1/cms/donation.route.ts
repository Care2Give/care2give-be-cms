import express from "express";
import donationController from "../../../controllers/cms/donation.controller";
import validate from "../../../middlewares/validate";
import donationValidation from "../../../validations/cms/donation.validation";

const router = express.Router();

router.get("/", donationController.listDonations);

router.post(
  "/export",
  validate(donationValidation.exportDonations),
  donationController.exportDonationsToXlsx
)

export default router;
