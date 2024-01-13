import catchAsync from "../../utils/catchAsync";
import Encrypter from "../../utils/Encrypter";
import httpStatus from "http-status";
import donationService from "../../services/cms/donation.service";

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

export default {
  listDonations,
};
