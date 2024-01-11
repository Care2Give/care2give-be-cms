import express from "express";
import validate from "../../middlewares/validate";
import { emailValidation } from "../../validations";
import { emailController } from "../../controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import clerkValidateOrigin from "../../middlewares/clerkValidateOrigin";

const router = express.Router();

router.use(ClerkExpressRequireAuth());
router.use(clerkValidateOrigin);

router.get("/ping", (_, res) => {
  res.send("Hello from email route!");
});

router.post(
  "/",
  validate(emailValidation.createEmailTemplate),
  emailController.createEmailTemplate
);

router.get("/", emailController.getLatestEmailTemplate);

// All emails page
router.get("/list", emailController.listEmailTemplates);

// Get email by id
router.get(
  "/:emailId",
  validate(emailValidation.findEmailTemplateById),
  emailController.findEmailTemplateById
);

export default router;
