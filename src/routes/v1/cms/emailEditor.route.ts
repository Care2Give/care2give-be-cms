import express from "express";
import emailEditorController from "../../../controllers/cms/emailEditor.controller";
import validate from "../../../middlewares/validate";
import emailEditorValidation from "../../../validations/cms/emailEditor.validation";

const router = express.Router();

router.get("/", emailEditorController.getLatestEmail);

router.post(
  "/",
  validate(emailEditorValidation.createEmailTemplate),
  emailEditorController.createEmail
);

router.post("/version-history", emailEditorController.listEmailTemplates);

export default router;
