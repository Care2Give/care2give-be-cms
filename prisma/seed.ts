import { PrismaClient } from "@prisma/client";
import { createCipheriv, randomBytes } from "crypto";

const encryptNric = (nric: string) => {
  const algorithm = "aes-256-gcm";
  const key = randomBytes(32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(nric, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const prisma = new PrismaClient();

async function main() {
  // SEED CAMPAIGNS
  const campaignOne = await prisma.campaign.create({
    data: {
      status: "ACTIVE",
      startDate: new Date("2023-12-12"),
      endDate: new Date("2024-12-12"),
      title: "Test Campaign One",
      description: "This is a test campaign",
      currency: "SGD",
      dollars: 123,
      cents: 45,
      createdBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      editedBy: "user_2aTuEiGpSymDZEOLf8f71iKsvrB",
      imageUrl: [
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
      imageUrl: ["https://i.imgur.com/XnXiEd3.jpeg"],
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
      imageUrl: [],
    },
  });
  console.log({ campaignOne, campaignTwo, campaignThree });

  // SEED CAMPAIGN DONATION AMOUNTS
  const campaignOneDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 1000,
        title: "Test Campaign Donation Amount One",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignOneDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 2000,
        title: "Test Campaign Donation Amount Two",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignOneDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 5000,
        title: "Test Campaign Donation Amount Three",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });

  const campaignTwoDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 2000,
        title: "Test Campaign Donation Amount One",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignTwoDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 5000,
        title: "Test Campaign Donation Amount Two",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignTwoDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 8000,
        title: "Test Campaign Donation Amount Three",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });

  const campaignThreeDonationAmountOne =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 100,
        title: "Test Campaign Donation Amount One",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignThreeDonationAmountTwo =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 200,
        title: "Test Campaign Donation Amount Two",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
      },
    });
  const campaignThreeDonationAmountThree =
    await prisma.campaignDonationAmount.create({
      data: {
        currency: "SGD",
        dollars: 300,
        title: "Test Campaign Donation Amount Three",
        description: "This is a test campaign donation amount",
        campaignId: campaignOne.id,
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
      donorNricA: encryptNric("S1234567A"),
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
      donorNricA: encryptNric("S1234567A"),
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
