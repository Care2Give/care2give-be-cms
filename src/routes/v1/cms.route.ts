import express, { Request } from "express";
import validate from "../../middlewares/validate";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import clerkValidateOrigin from "../../middlewares/clerkValidateOrigin";
import { cmsController } from "../../controllers";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
const router = express.Router();

router.use(ClerkExpressRequireAuth());
router.use(clerkValidateOrigin);

router.get("/", (req: RequireAuthProp<Request>, res) => {
  // console.log(req.auth);
  res.send("Hello World");
});

router.get("/campaigns", cmsController.listCampaigns);
export default router;
