import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import Stripe from 'stripe';
import { PaymentIntentRequest } from "../types/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const getConfig = () => {
    return process.env.STRIPE_PUBLISHABLE_KEY;
};

const createPaymentIntent = async (request: PaymentIntentRequest) => {
    const formatted_payment_method_type = request.payment_method_type == 'link' ? ['link', 'card'] : [request.payment_method_type]

    const params: Stripe.PaymentIntentCreateParams = {
        amount: request.amount,
        currency: request.currency,
        payment_method_types: formatted_payment_method_type,
    };
    try {
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);
        return paymentIntent.client_secret;
    } catch (error: unknown) {
        if (error instanceof Stripe.errors.StripeError) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create payment intent');
        }
    }
};

const handleWebhookEvent = async (req: any) => {
    const sig = req.headers['stripe-signature'];
    const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET || "";
    
    const event = stripe.webhooks.constructEvent(req.body, sig, webhook_secret);

    switch (event.type) {
        case 'payment_intent.created':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was created!', "id: ", paymentIntent.id);
            break;
        case 'payment_intent.succeeded':
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_intent.payment_failed':
            console.log('Payment failed!');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
}
export default {
    getConfig,
    createPaymentIntent,
    handleWebhookEvent
};
