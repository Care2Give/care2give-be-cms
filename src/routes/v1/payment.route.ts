import express from "express";
import validate from "../../middlewares/validate";
import { paymentController } from "../../controllers";
import { paymentValidation } from "../../validations";

const router = express.Router();

router.get(
  "/config",
  paymentController.getConfig
);
  
router.post(
  "/createPaymentIntent",
  validate(paymentValidation.createPaymentIntent),
  paymentController.createPaymentIntent
);

router.post(
  "/webhook",
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhookEvent
);

export default router;
