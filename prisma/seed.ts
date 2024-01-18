import { PrismaClient } from "@prisma/client";
import Encrypter from "../src/utils/Encrypter";
import "dotenv/config";

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
      imageNames: ["Hzokhnc.jpeg", "3E1zOoW.jpeg", "5iRPHZe.jpeg"],
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
      imageNames: ["XnXiEd3.jpeg"],
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
      imageNames: ["lQGgBef.jpeg"],
      imageUrls: ["https://i.imgur.com/lQGgBef.jpeg"],
    },
  });
  console.log({ campaignOne, campaignTwo, campaignThree });

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
    },
  });
  const donationTwo = await prisma.donation.create({
    data: {
      donationType: "ANONYMOUS",
      dollars: 100,
      campaignId: campaignOne.id,
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
    },
  });
  // donationType          String    @db.VarChar(20)
  // donorFirstName        String?
  // donorLastName         String?
  // donorEmail            String?
  // donorNricA            String?
  // donorNricB            String?   @db.VarChar(4)
  // donorTrainingPrograms String[]
  // currency              String    @default("SGD") @db.VarChar(3)
  // dollars               Int       @default(0)
  // cents                 Int       @default(0)
  // campaign              Campaign  @relation(fields: [campaignId], references: [id])
  // campaignId            String

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
