import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  ExerciseStatus,
  SkillLevel,
  TrainingType,
  EntityState,
} from "@prisma/client";

/**
 * Run with:
 * npx tsx __scripts/seed-exercises.ts
 */

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 30 training exercises...");

  for (let i = 0; i < 30; i++) {
    await prisma.trainingExercise.create({
      data: {
        label: faker.lorem.words(3),
        duration: faker.number.int({ min: 30, max: 180 }), // in seconds
        practiceInstruction: faker.lorem.sentence(),
        thumbnail: faker.image.urlPicsumPhotos({ width: 640, height: 360 }),
        type: faker.helpers.arrayElement<TrainingType>([
          "technique",
          "rally",
          "serve",
          "return",
          "footwork",
        ]),
        repsInstruction: `${faker.number.int({
          min: 3,
          max: 5,
        })} x ${faker.number.int({ min: 5, max: 12 })}`,

        skillLevel: faker.helpers.arrayElement<SkillLevel>([
          "BEGINNER",
          "INTERMEDIATE",
          "ADVANCED",
        ]),
        intensityScore: faker.number.int({ min: 1, max: 5 }),
        coachNotes: faker.lorem.sentences(2),
        entityState: "CREATED",
      },
    });
  }

  console.log("✅ Seeded 30 exercises successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding exercises:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
