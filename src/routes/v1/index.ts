import express from "express";
import campaignRoute from "./campaign.route";
import emailRoute from "./email.route";
import cmsRoute from "./cms.route";
import docsRoute from "./docs.route";
import config from "../../config/config";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/campaign",
    route: campaignRoute,
  },
  {
    path: "/email",
    route: emailRoute,
  },
  {
    path: "/cms",
    route: cmsRoute,
  },
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
