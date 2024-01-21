import express from "express";
import homepageAnalyticsController from "../../../controllers/cms/homepageAnalytics.controller";
import errorHandler from "../../../middlewares/errorHandler";

const router = express.Router();

router.get(
  "/total-donation-amount",
  homepageAnalyticsController.totalDonationAmount,
  errorHandler
);
router.get(
  "/total-donor-number",
  homepageAnalyticsController.totalDonorNumber,
  errorHandler
);
router.get(
  "/highest-donation-amount",
  homepageAnalyticsController.highestDonationAmount,
  errorHandler
);
router.get(
  "/most-popular-campaign",
  homepageAnalyticsController.mostPopularCampaign,
  errorHandler
);
router.get(
  "/most-popular-amount",
  homepageAnalyticsController.mostPopularAmount,
  errorHandler
);
router.get(
  "/types-of-donations",
  homepageAnalyticsController.typesOfDonations,
  errorHandler
);
router.get(
  "/daily-donations",
  homepageAnalyticsController.dailyDonations,
  errorHandler
);

export default router;
