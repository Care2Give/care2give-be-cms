import express from "express";
import emailEditorController from "../../../controllers/cms/emailEditor.controller";
import validate from "../../../middlewares/validate";
import emailEditorValidation from "../../../validations/cms/emailEditor.validation";
import errorHandler from "../../../middlewares/errorHandler";

const router = express.Router();

router.get("/", emailEditorController.getLatestEmail, errorHandler);
router.get(
  "/version-history",
  emailEditorController.listEmailTemplates,
  errorHandler
);

router.post(
  "/",
  validate(emailEditorValidation.createEmailTemplate),
  emailEditorController.createEmail,
  errorHandler
);

router.post(
  "/send",
  validate(emailEditorValidation.sendEmail),
  emailEditorController.sendEmail,
  errorHandler
);

export default router;
