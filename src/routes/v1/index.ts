import express from "express";
import campaignRoute from "./campaign.route";
import cmsRoute from "./cms.route";
import docsRoute from "./docs.route";
import config from "../../config/config";
import paymentRoute from "./payment.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/campaign",
    route: campaignRoute,
  },
  {
    path: "/cms",
    route: cmsRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
