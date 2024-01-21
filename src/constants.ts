export const BUCKET_NAME = process.env.BUCKET_NAME as string;
export const BUCKET_REGION = process.env.BUCKET_REGION as string;
export const ACCESS_KEY = process.env.ACCESS_KEY as string;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string;

export const DONATIONS_EXPORT_HEADERS = [
  { header: "ID", key: "id" },
  {
    header: "Date and Time (GMT)",
    key: "dateTime",
    width: 20,
    style: { numFmt: "dd/mm/yyyy hhmm AM/PM" },
  },
  { header: "Donor", key: "donor" },
  { header: "Amount", key: "amount" },
  { header: "Campaign", key: "campaign" },
  { header: "Status", key: "status" },
  { header: "Type of Donation", key: "type" },
  { header: "Email", key: "email" },
  { header: "NRIC", key: "nric" },
  { header: "Training Programs", key: "trainingPrograms" },
];

export const ONE_HOUR_IN_SECONDS = 60 * 60;
export const FIVE_MEGABYTES = 1 * 1000 * 1000 * 5;
