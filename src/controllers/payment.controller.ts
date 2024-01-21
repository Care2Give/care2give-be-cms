import httpStatus from "http-status";
import { donationService, paymentService } from "../services";
import catchAsync from "../utils/catchAsync";
import { Prisma, DonationPaymentStatus } from "@prisma/client";
import { PaymentStatus } from "../types/payment";

// # TODO: Confirm the request attributes.
const createPaymentIntent = catchAsync(async (req, res) => {
    const { 
        campaignId,
        donationType,
        donorFirstName,
        donorLastName,
        donorEmail,
        donorNricA,
        donorNricB,
        donorTrainingPrograms,
        dollars,
        cents,
        currency,
    } = req.body;
    const amount = dollars * 100 + cents;

    const {clientSecret, paymentIntentId} = await paymentService.createPaymentIntent({
        amount,
        currency,
    });

    const donation: Prisma.DonationCreateInput = {
        donationType: donationType,
        donorFirstName: donorFirstName,
        donorLastName: donorLastName,
        donorEmail: donorEmail,
        donorNricA: donorNricA,
        donorNricB: donorNricB,
        donorTrainingPrograms: donorTrainingPrograms,
        currency: currency,
        dollars: dollars,
        cents: cents,
        campaign: {
            connect: {
                id: campaignId,
            },
        },
        paymentId: paymentIntentId,
    };

    const { id } = await donationService.createDonation(donation);

    await paymentService.updatePaymentIntent(paymentIntentId, { metadata: { donationId: id } });

    res.status(httpStatus.CREATED).send({ clientSecret });
});

const getConfig = catchAsync(async (_, res) => {
    const publishable_key = await paymentService.getConfig();
    res.status(httpStatus.OK).send({ publishable_key });
});

const handleWebhookEvent = catchAsync(async (req, res) => {
    const { paymentStatus, paymentIntentId, donationId } = await paymentService.handleWebhookEvent(req);
    if (paymentIntentId && donationId) {
        switch (paymentStatus) {
            case PaymentStatus.SUCCEEDED || PaymentStatus.CREATED:
                await donationService.updateDonation(donationId, { paymentStatus: DonationPaymentStatus.SUCCEEDED });
                break;
            case PaymentStatus.FAILED:
                await donationService.updateDonation(donationId, { paymentStatus: DonationPaymentStatus.FAILED });
                break;
            case PaymentStatus.CANCELLED:
                await donationService.updateDonation(donationId, { paymentStatus: DonationPaymentStatus.CANCELLED });
                break;
            default:
                break;
        }
    }
    res.status(httpStatus.OK).send();
});

export default {
    createPaymentIntent,
    getConfig,
    handleWebhookEvent
};
