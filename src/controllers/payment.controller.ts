import httpStatus from "http-status";
import { donationService, paymentService } from "../services";
import catchAsync from "../utils/catchAsync";
import { Prisma, DonationPaymentStatus, DonationType } from "@prisma/client";
import { PaymentStatus } from "../types/payment.types";
import emailEditorService from "../services/cms/emailEditor.service";

// # TODO: Confirm the request attributes.
const createPaymentIntent = catchAsync(async (req, res) => {
    const { 
        donationCartItems,
        donationType,
        donorFirstName,
        donorLastName,
        donorEmail,
        donorNricA,
        donorNricB,
        donorTrainingPrograms,
        currency,
    } = req.body;

    const amount = donationCartItems.reduce((total: number, item: any) => total + item.dollars * 100 + item.cents, 0);
    const {clientSecret, paymentIntentId} = await paymentService.createPaymentIntent({
        amount,
        currency,
    });
    
    const donationPromises = donationCartItems.map(async (item: any) => {
        const { campaignId, dollars, cents } = item;
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
        return id;
    });

    const donationIds = await Promise.all(donationPromises);
    await paymentService.updatePaymentIntent(paymentIntentId, { metadata: {donationIds: JSON.stringify(donationIds)} });

  res.status(httpStatus.CREATED).send({ clientSecret });
});

const getConfig = catchAsync(async (_, res) => {
  const publishable_key = await paymentService.getConfig();
  res.status(httpStatus.OK).send({ publishable_key });
});

const sendDonationSuccessEmail = async (donationIds: string[]) => {
  const templateEmail = await emailEditorService.getLatestEmail();
  if (templateEmail === null) {
    console.log(`[LOG] Failed to send confirmation email for donations ${donationIds}, no template email found!`);
    return;
  }

  const donations = await donationService.queryDonations({id: {in: donationIds}}, {limit: donationIds.length});
  const donorEmails = donations
    .filter(x => x.donationType !== DonationType.ANONYMOUS)
    .reduce((currentSet, donation) => {
      currentSet.add(donation.donorEmail as string);
      return currentSet;
    }, new Set<string>());

  donorEmails.forEach((email) => {
    emailEditorService.sendEmail([email], templateEmail.subject, templateEmail.content)
  });
}

const handleWebhookEvent = catchAsync(async (req, res) => {
    const { paymentStatus, paymentIntentId, donationIds } = await paymentService.handleWebhookEvent(req);
    var donationPaymentStatus: DonationPaymentStatus = DonationPaymentStatus.PENDING;
    if (paymentIntentId && donationIds.length > 0) {
        switch (paymentStatus) {
            case PaymentStatus.SUCCEEDED || PaymentStatus.CREATED:
                if (paymentStatus === PaymentStatus.SUCCEEDED)
                  sendDonationSuccessEmail(donationIds);
                donationPaymentStatus = DonationPaymentStatus.SUCCEEDED;
                break;
            case PaymentStatus.FAILED:
                donationPaymentStatus = DonationPaymentStatus.FAILED;
                break;
            case PaymentStatus.CANCELLED:
                donationPaymentStatus = DonationPaymentStatus.CANCELLED;
                break;
            default:
                break;
        }
    }
    donationIds.forEach(async (donationId: string) => {
        await donationService.updateDonation(donationId, { paymentStatus: donationPaymentStatus });
    });
    res.status(httpStatus.OK).send();
});

export default {
  createPaymentIntent,
  getConfig,
  handleWebhookEvent,
};
