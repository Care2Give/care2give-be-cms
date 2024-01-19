import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import Stripe from 'stripe';
import { HandleWebhookEventResponse, PaymentIntentRequest, PaymentIntentResponse, PaymentStatus } from "../types/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const getConfig = () => {
    return process.env.STRIPE_PUBLISHABLE_KEY;
};

const createPaymentIntent = async (request: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
    const params: Stripe.PaymentIntentCreateParams = {
        amount: request.amount,
        currency: request.currency,
        // Enable automatic_payment_methods so that Stripe accepts payment methods that you enable in the Dashboard
        // that are compatible with other parameters such as currency (eg. PayNow, Visa).
        automatic_payment_methods: {enabled: true},
    };
    try {
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);
        return {
            clientSecret: paymentIntent.client_secret, 
            paymentIntentId: paymentIntent.id
        };
    } catch (error: unknown) {
        if (error instanceof Stripe.errors.StripeError) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create payment intent');
        }
    }
};

const handleWebhookEvent = async (req: any): Promise<HandleWebhookEventResponse> => {
    const sig = req.headers['stripe-signature'];
    const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET || "";
    
    const event = stripe.webhooks.constructEvent(req.body, sig, webhook_secret);
    var paymentStatus = PaymentStatus.UNKNOWN;
    Stripe.PaymentIntentsResource;

    switch (event.type) {
        case 'payment_intent.created':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was created!', "id: ", paymentIntent.id);
            paymentStatus = PaymentStatus.CREATED;
            break;
        case 'payment_intent.succeeded':
            console.log('PaymentIntent was successful!');
            paymentStatus = PaymentStatus.SUCCEEDED;
            break;
        case 'payment_intent.payment_failed':
            console.log('Payment failed!');
            paymentStatus = PaymentStatus.FAILED;
            break;
        case 'payment_intent.canceled':
            console.log('Payment cancelled!');
            paymentStatus = PaymentStatus.CANCELLED;
            break;
        default:
            return { paymentStatus: paymentStatus, paymentIntentId: undefined};
    }
    return { paymentStatus: paymentStatus, paymentIntentId: (event.data.object as Stripe.PaymentIntent).id };
}
export default {
    getConfig,
    createPaymentIntent,
    handleWebhookEvent
};
