import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";

const ses = new aws.SES({
  region: process.env.SES_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
} as aws.SESClientConfig);

export const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});
