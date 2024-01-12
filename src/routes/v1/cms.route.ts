import express, { Request } from "express";
import validate from "../../middlewares/validate";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import clerkValidateOrigin from "../../middlewares/clerkValidateOrigin";
import { cmsController } from "../../controllers";
import { emailValidation } from "../../validations";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
const router = express.Router();

router.use(ClerkExpressRequireAuth());
router.use(clerkValidateOrigin);

router.get("/", (req: RequireAuthProp<Request>, res) => {
  res.send("Hello World");
});

router.get("/donations", cmsController.listDonations);

router.get("/campaigns", cmsController.listCampaigns);

router
  .route("/email-editor")
  .get(cmsController.getLatestEmail)
  .post(
    validate(emailValidation.createEmailTemplate),
    cmsController.createEmail
  );

router.get("/email-editor/version-history", cmsController.listEmailTemplates);

export default router;
