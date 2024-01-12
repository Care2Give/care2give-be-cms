import express, { NextFunction, Request, Response } from "express";
import validate from "../../middlewares/validate";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import clerkValidateOrigin from "../../middlewares/clerkValidateOrigin";
import campaignRouter from "./cms/campaigns.route";

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
  // console.log(req.auth);
  res.send("Hello World");
});

cmsRoutes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
