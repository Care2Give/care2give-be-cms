import express from "express";
import emailEditorController from "../../../controllers/cms/emailEditor.controller";
import validate from "../../../middlewares/validate";
import emailEditorValidation from "../../../validations/cms/emailEditor.validation";

const router = express.Router();

router.get("/", emailEditorController.getLatestEmail);
router.get("/version-history", emailEditorController.listEmailTemplates);

router.post(
  "/",
  validate(emailEditorValidation.createEmailTemplate),
  emailEditorController.createEmail
);

export default router;
