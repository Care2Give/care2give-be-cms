import express from "express";
import emailEditorController from "../../../controllers/cms/emailEditor.controller";
import validate from "../../../middlewares/validate";
import emailEditorValidation from "../../../validations/cms/emailEditor.validation";
import apiErrorHandler from "../../../middlewares/apiErrorHandler";

const router = express.Router();

router.get("/", emailEditorController.getLatestEmail);
router.get("/version-history", emailEditorController.listEmailTemplates);

router.post(
  "/",
  validate(emailEditorValidation.createEmailTemplate),
  emailEditorController.createEmail,
  apiErrorHandler
);

router.post(
  "/send",
  validate(emailEditorValidation.sendEmail),
  emailEditorController.sendEmail,
  apiErrorHandler
);

export default router;
