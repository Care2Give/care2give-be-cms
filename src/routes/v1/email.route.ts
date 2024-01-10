import express from "express";
import validate from "../../middlewares/validate";
import { emailValidation } from "../../validations";
import { emailController } from "../../controllers";

const router = express.Router();

router.get("/ping", (_, res) => {
  res.send("Hello from email route!");
});

router.post(
  "/",
  validate(emailValidation.createEmailTemplate),
  emailController.createEmailTemplate
);

// All emails page
router.get("/list", emailController.listEmailTemplates);

// Get email by id
router.get(
  "/:emailId",
  validate(emailValidation.findEmailTemplateById),
  emailController.findEmailTemplateById
);

export default router;
