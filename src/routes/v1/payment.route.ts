import express from "express";
import validate from "../../middlewares/validate";
import { paymentController } from "../../controllers";

const router = express.Router();

router.get(
  "/config",
  paymentController.getConfig
);
  
router.post(
  "/createPaymentIntent",
  paymentController.createPaymentIntent
);

router.post(
  "/webhook",
  paymentController.handleWebhookEvent
);

export default router;
