import express from "express";
import homepageAnalyticsController from "../../../controllers/cms/homepageAnalytics.controller";
import apiErrorHandler from "../../../middlewares/apiErrorHandler";

const router = express.Router();

router.get(
  "/total-donation-amount",
  homepageAnalyticsController.totalDonationAmount,
  apiErrorHandler
);
router.get(
  "/total-donor-number",
  homepageAnalyticsController.totalDonorNumber,
  apiErrorHandler
);
router.get(
  "/highest-donation-amount",
  homepageAnalyticsController.highestDonationAmount,
  apiErrorHandler
);
router.get(
  "/most-popular-campaign",
  homepageAnalyticsController.mostPopularCampaign,
  apiErrorHandler
);
router.get(
  "/most-popular-amount",
  homepageAnalyticsController.mostPopularAmount,
  apiErrorHandler
);
router.get(
  "/types-of-donations",
  homepageAnalyticsController.typesOfDonations,
  apiErrorHandler
);
router.get(
  "/daily-donations",
  homepageAnalyticsController.dailyDonations,
  apiErrorHandler
);

export default router;
