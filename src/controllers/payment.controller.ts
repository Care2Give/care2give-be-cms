import httpStatus from "http-status";
import { paymentService } from "../services";
import catchAsync from "../utils/catchAsync";

const createPaymentIntent = catchAsync(async (req, res) => {
    const { amount, currency, payment_method_type } = req.body;
    const client_secret = await paymentService.createPaymentIntent({
        amount,
        currency,
        payment_method_type,
    });
    res.status(httpStatus.CREATED).send({ client_secret });
});

const getConfig = catchAsync(async (_, res) => {
    const publishable_key = await paymentService.getConfig();
    res.status(httpStatus.OK).send({ publishable_key });
});

const handleWebhookEvent = catchAsync(async (req, res) => {
    await paymentService.handleWebhookEvent(req);
    res.status(httpStatus.OK).send();
});

export default {
    createPaymentIntent,
    getConfig,
    handleWebhookEvent
};
