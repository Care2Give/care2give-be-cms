import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import crypto from "crypto";

class Encrypter {
  algorithm: string;
  key: Buffer;

  constructor(encryptionKey: string) {
    this.algorithm = "aes-192-cbc";
    this.key = crypto.scryptSync(encryptionKey, "salt", 24);
  }

  encrypt(clearText: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(clearText, "utf8", "hex");
    return [
      encrypted + cipher.final("hex"),
      Buffer.from(iv).toString("hex"),
    ].join("|");
  }

  dencrypt(encryptedText: string) {
    const [encrypted, iv] = encryptedText.split("|");
    if (!iv) throw new Error("IV not found");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex")
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}

const prisma = new PrismaClient();

async function main() {
  const encrypter = new Encrypter(process.env.ENCRYPTION_SECRET as string);
  // SEED CAMPAIGNS
  const campaignOne = await prisma.campaign.create({
    data: {
      status: "ACTIVE",
      startDate: new Date("2023-12-12"),
      endDate: new Date("2024-12-12"),
      title: "Test Campaign One",
      description: "This is a test campaign",
      currency: "SGD",
      dollars: 2000,
      cents: 45,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrls: [
        "https://i.imgur.com/Hzokhnc.jpeg",
        "https://i.imgur.com/3E1zOoW.jpeg",
        "https://i.imgur.com/5iRPHZe.jpeg",
      ],
    },
  });
  const campaignTwo = await prisma.campaign.create({
    data: {
      status: "ACTIVE",
      startDate: new Date("2023-12-13"),
      endDate: new Date("2024-12-12"),
      title: "Test Campaign Two",
      description: "This is test campaign two",
      currency: "SGD",
      dollars: 34534,
      cents: 0,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrls: ["https://i.imgur.com/XnXiEd3.jpeg"],
    },
  });
  const campaignThree = await prisma.campaign.create({
    data: {
      status: "ACTIVE",
      startDate: new Date("2023-12-14"),
      endDate: new Date("2024-12-12"),
      title: "Test Campaign Three",
      description: "",
      currency: "SGD",
      dollars: 983534,
      cents: 0,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrls: ["https://i.imgur.com/lQGgBef.jpeg"],
    },
  });
  const campaignFour = await prisma.campaign.create({
    data: {
      status: "INACTIVE",
      startDate: new Date("2023-12-14"),
      endDate: new Date("2023-12-12"),
      title: "Test Campaign Four",
      description: "",
      currency: "SGD",
      dollars: 1000,
      cents: 0,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrls: ["https://i.imgur.com/lQGgBef.jpeg"],
    },
  });
  const campaignFive = await prisma.campaign.create({
    data: {
      status: "ARCHIVED",
      startDate: new Date("2020-12-14"),
      endDate: new Date("2020-12-12"),
      title: "Test Campaign Five",
      description: "",
      currency: "SGD",
      dollars: 1000,
      cents: 0,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrls: ["https://i.imgur.com/lQGgBef.jpeg"],
    },
  });
  console.log({
    campaignOne,
    campaignTwo,
    campaignThree,
    campaignFour,
    campaignFive,
  });

  // SEED CAMPAIGN DONATION AMOUNTS
  const campaignOneDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 1000,
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignOneDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 2000,
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignOneDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 5000,
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });

  const campaignTwoDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 2000,
        description: "This is a test campaign donation amount",
        campaignId: campaignTwo.id,
      },
    });
  const campaignTwoDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 5000,
        description: "This is a test campaign donation amount",
        campaignId: campaignTwo.id,
      },
    });
  const campaignTwoDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 8000,
        description: "This is a test campaign donation amount",
        campaignId: campaignTwo.id,
      },
    });

  const campaignThreeDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 100,
        description: "This is a test campaign donation amount",
        campaignId: campaignThree.id,
      },
    });
  const campaignThreeDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 200,
        description: "This is a test campaign donation amount",
        campaignId: campaignThree.id,
      },
    });
  const campaignThreeDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 300,
        description: "This is a test campaign donation amount",
        campaignId: campaignThree.id,
      },
    });

  console.log({
    campaignOneDonationAmountOne,
    campaignOneDonationAmountTwo,
    campaignOneDonationAmountThree,
    campaignTwoDonationAmountOne,
    campaignTwoDonationAmountTwo,
    campaignTwoDonationAmountThree,
    campaignThreeDonationAmountOne,
    campaignThreeDonationAmountTwo,
    campaignThreeDonationAmountThree,
  });

  // SEED EMAILS
  const emailOne = await prisma.email.create({
    data: {
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      subject: "Test Email One",
      content: "This is a test email",
    },
  });
  const emailTwo = await prisma.email.create({
    data: {
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      subject: "Test Email Two",
      content: `The content was 'This is a test email'. It has been updated.`,
    },
  });
  console.log({ emailOne, emailTwo });

  // SEED DONATIONS
  const donationOne = await prisma.donation.create({
    data: {
      donationType: "INDIVIDUAL_WITH_TAX_DEDUCTION",
      donorFirstName: "John",
      donorLastName: "Doe",
      donorEmail: "johndoe@gmail.com",
      donorNricA: encrypter.encrypt("S1234"),
      donorNricB: "567A",
      donorTrainingPrograms: ["A", "B"],
      currency: "SGD",
      dollars: 123,
      cents: 45,
      campaignId: campaignOne.id,
      paymentStatus: "SUCCEEDED",
      paymentId: "pi_3OU3H0FLvGMxrP6C1oHRnQyV",
    },
  });
  const donationTwo = await prisma.donation.create({
    data: {
      donationType: "ANONYMOUS",
      dollars: 100,
      campaignId: campaignOne.id,
      paymentStatus: "PENDING",
      paymentId: "pi_3OWtUvFLvGMxrP6C13tyd2xc",
    },
  });
  const donationThree = await prisma.donation.create({
    data: {
      donationType: "WITHOUT_TAX_DEDUCTION",
      donorFirstName: "Jane",
      donorLastName: "Doe",
      donorEmail: "janedoe@gmail.com",
      dollars: 100,
      campaignId: campaignOne.id,
      paymentStatus: "PENDING",
      paymentId: "pi_3OTgcUFLvGMxrP6C0Ak1ATsI",
    },
  });
  const donationFour = await prisma.donation.create({
    data: {
      donationType: "WITHOUT_TAX_DEDUCTION",
      donorFirstName: "Jane",
      donorLastName: "Doe",
      donorEmail: "janedoe@gmail.com",
      currency: "SGD",
      dollars: 10,
      campaignId: campaignTwo.id,
      paymentStatus: "PENDING",
      paymentId: "pi_3ORXzfFLvGMxrP6C0x1ozPDb",
    },
  });
  const donationFive = await prisma.donation.create({
    data: {
      donationType: "INDIVIDUAL_WITH_TAX_DEDUCTION",
      donorFirstName: "John",
      donorLastName: "Doe",
      donorEmail: "johndoe@gmail.com",
      donorNricA: encrypter.encrypt("S1234"),
      donorNricB: "567A",
      donorTrainingPrograms: ["A", "B"],
      dollars: 1000,
      campaignId: campaignOne.id,
      paymentStatus: "PENDING",
      paymentId: "pi_3ORXvkFLvGMxrP6C1sx1cBUe",
      createdAt: new Date("2023-12-28"),
    },
  });

  console.log({
    donationOne,
    donationTwo,
    donationThree,
    donationFour,
    donationFive,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
