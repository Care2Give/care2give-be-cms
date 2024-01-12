import express from "express";
import donationController from "../../../controllers/cms/donation.controller";

const router = express.Router();

router.get("/", donationController.listDonations);

export default router;
