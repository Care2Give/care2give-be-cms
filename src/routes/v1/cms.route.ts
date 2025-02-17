import express, { NextFunction, Request, Response } from "express";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import clerkValidateOrigin from "../../middlewares/clerkValidateOrigin";
import campaignRouter from "./cms/campaign.route";
import donationRouter from "./cms/donation.route";
import emailEditorRouter from "./cms/emailEditor.route";
import analyticsRouter from "./cms/analytics.route";
import homepageAnalyticsRouter from "./cms/homepageAnalytics.route";
import errorHandler from "../../middlewares/errorHandler";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
const router = express.Router();

const cmsRoutes = [
  {
    path: "/campaigns",
    route: campaignRouter,
  },
  {
    path: "/donations",
    route: donationRouter,
  },
  {
    path: "/email-editor",
    route: emailEditorRouter,
  },
  {
    path: "/analytics",
    route: analyticsRouter,
  },
  {
    path: "/homepage-analytics",
    route: homepageAnalyticsRouter,
  },
];

router.use(
  ClerkExpressRequireAuth(),
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
  }
);
router.use(clerkValidateOrigin);

router.get("/", (req: RequireAuthProp<Request>, res) => {
  res.send("Hello World");
});

cmsRoutes.forEach(({ path, route }) => {
  router.use(path, route, errorHandler);
});

export default router;
