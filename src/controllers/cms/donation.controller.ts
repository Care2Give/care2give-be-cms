import catchAsync from "../../utils/catchAsync";
import Encrypter from "../../utils/Encrypter";
import httpStatus from "http-status";
import donationService from "../../services/cms/donation.service";
import moment from "moment";
import { stringify } from 'csv';

const listDonations = catchAsync(async (_, res) => {
  const encrypter = new Encrypter(process.env.ENCRYPTION_SECRET as string);
  const donations = await donationService.listDonations();
  const result = donations.map(
    ({ donorNricA, donorNricB, campaignId, ...donation }) => {
      if (donorNricA && donorNricB) {
        return {
          ...donation,
          nric: `${encrypter.dencrypt(donorNricA)}${donorNricB}`,
        };
      }
      return {
        ...donation,
      };
    }
  );
  res.status(httpStatus.OK).send(result);
});

const CSV_HEADERS = [
  'ID', 'Date and Time', 'Donor', 'Amount',
  'Campaign', 'Status', 'Type of Donation',
  'Email', 'NRIC', 'Training Programs'
]

const exportDonationsToCsv = catchAsync(async (_, res) => {
  const encrypter = new Encrypter(process.env.ENCRYPTION_SECRET as string);
  const donations = await donationService.listDonations();
  const result = donations.map(
    ({ donorNricA, donorNricB, campaignId, ...donation }) => {
      if (donorNricA && donorNricB) {
        return {
          ...donation,
          nric: `${encrypter.dencrypt(donorNricA)}${donorNricB}`,
        };
      }
      return {
        ...donation,
        nric: null
      };
    }
  );

  res.status(httpStatus.OK).set({
    'Content-Disposition': 'attachment; filename="donations.csv"'
  });

  const stringfier = stringify();
  stringfier.write(CSV_HEADERS)
  stringfier.pipe(res)
  result.forEach((donation) => {
    const record = {
      id: donation.id,
      dateTime: moment(donation.createdAt).format('DD/MM/YYYY HHmm'),
      donor: donation.donorFirstName ? `${donation.donorFirstName} ${donation.donorLastName}` : '-',
      amount: `${donation.currency}${donation.dollars}.${donation.cents}`,
      campaign: donation.campaign.title,
      status: donation.campaign.status,
      donationType: donation.donationType,
      email: donation.donorEmail,
      nric: donation.nric ? donation.nric : '-',
      trainingProgram: donation.donorTrainingPrograms.join(', ')
    };

    stringfier.write([
      record.id, record.dateTime, record.donor, record.amount,
      record.campaign, record.status, record.donationType,
      record.email, record.nric, record.trainingProgram
    ])
  });
  stringfier.end()
})

export default {
  listDonations,
  exportDonationsToCsv
};
