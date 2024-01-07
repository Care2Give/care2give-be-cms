import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const campaignOne = await prisma.campaign.create({
    data: {
      status: "ACTIVE",
      startDate: new Date("2023-12-12"),
      endDate: new Date(),
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
      endDate: new Date(),
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
      endDate: new Date(),
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
