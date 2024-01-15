import express from "express";
import homepageAnalyticsController from "../../../controllers/cms/homepageAnalytics.controller";

const router = express.Router();

router.get("/total-donation-amount", homepageAnalyticsController.totalDonationAmount);
router.get("/total-donor-number", homepageAnalyticsController.totalDonorNumber)
router.get("/highest-donation-amount", homepageAnalyticsController.highestDonationAmount)
router.get("/most-popular-campaign", homepageAnalyticsController.mostPopularCampaign)
router.get("/most-popular-amount", homepageAnalyticsController.mostPopularAmount)
router.get("/types-of-donations", homepageAnalyticsController.typesOfDonations)
router.get("/daily-donations", homepageAnalyticsController.dailyDonations)

export default router;
