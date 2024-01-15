import catchAsync from "../../utils/catchAsync";
import Encrypter from "../../utils/Encrypter";
import httpStatus from "http-status";
import donationService from "../../services/cms/donation.service";
import excelJS from "exceljs";
import { DONATIONS_EXPORT_HEADERS } from "../../constants";

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

const exportDonationsToXlsx = catchAsync(async (req, res) => {
  const { campaignIds, startDate, endDate } = req.body;
  const encrypter = new Encrypter(process.env.ENCRYPTION_SECRET as string);
  const donations = await donationService.exportDonations({campaignIds, startDate, endDate});
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
    'Content-Disposition': 'attachment; filename="donations.xlsx"'
  });

  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Donations')
  worksheet.columns = DONATIONS_EXPORT_HEADERS
  result.forEach((donation) => {
    const record = {
      id: donation.id,
      dateTime: donation.createdAt,
      donor: donation.donorFirstName ? `${donation.donorFirstName} ${donation.donorLastName}` : '-',
      amount: `${donation.currency}${donation.dollars}.${donation.cents}`,
      campaign: donation.campaign.title,
      status: donation.campaign.status,
      donationType: donation.donationType,
      email: donation.donorEmail,
      nric: donation.nric ? donation.nric : '-',
      trainingPrograms: donation.donorTrainingPrograms.join(', ')
    };
    worksheet.addRow(record)
  });
  workbook.xlsx.write(res);
})

export default {
  listDonations,
  exportDonationsToXlsx
};
