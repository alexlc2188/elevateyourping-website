import { faker } from "@faker-js/faker";
import { PrismaClient, MatchStatus, MatchOffer } from "@prisma/client";

/** TO RUN IT
 * npx tsx __scripts/seed-matches.ts
 */

const prisma = new PrismaClient();

// Your existing user IDs
const userIds = [
  "6825a77577a2108449c3fe97",
  "682810e02f7f7ca5fbb71955",
  "6829eb7212ebfe35ba2075f6",
  "682ba782259cd7ff6ba10839",
  "682d4f0d6e2aa8df6432db29",
];

async function main() {
  console.log("Seeding 20 matches...");

  for (let i = 0; i < 20; i++) {
    const randomUserId = faker.helpers.arrayElement(userIds);

    await prisma.match.create({
      data: {
        logNote: "",
        matchDate: new Date(Date.now()),
        userId: randomUserId,
        opponentName: faker.person.fullName(),
        aboutMe: faker.lorem.sentences(2),
        finalScore: `${faker.number.int({ min: 0, max: 4 })}-${faker.number.int(
          { min: 0, max: 4 },
        )}`,
        eventName: faker.company.name(),
        notes: faker.lorem.sentence(),
        highlightVideoId: faker.datatype.boolean() ? faker.string.uuid() : null,
        reviewVideoId: faker.datatype.boolean() ? faker.string.uuid() : null,
        isFullDetailsAnalysis: faker.datatype.boolean(),
        // Create the proper nested relation for detailedSetVideos
        detailedSetVideos: {
          create: Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            (_, index) => ({
              videoId: faker.string.uuid(),
              setNumber: index + 1,
            }),
          ),
        },
        offerType: faker.helpers.arrayElement<MatchOffer>([
          "REVIEW_ONLY",
          "REVIEW_AND_PLAN",
        ]),
        upgradedToFull: faker.datatype.boolean(),
      },
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
