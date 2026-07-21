import { TrainingType } from "@prisma/client";

export const packs = [
  {
    id: "1",
    title: "Forehand Fundamentals",
    type: TrainingType.rally,
    drills: 6,
    duration: "31 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869959_1280.jpg",
  },
  {
    id: "2",
    title: "Spin to Win",
    type: TrainingType.serve,
    drills: 7,
    duration: "39 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869957_1280.jpg",
  },
  {
    id: "3",
    title: "Backhand Blitz",
    type: TrainingType.serve,
    drills: 4,
    duration: "43 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869958_1280.jpg",
  },
  {
    id: "4",
    title: "Serve Like a Pro",
    type: TrainingType.footwork,
    drills: 4,
    duration: "33 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869960_1280.jpg",
  },
  {
    id: "5",
    title: "Footwork Frenzy",
    type: TrainingType.footwork,
    drills: 6,
    duration: "36 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869961_1280.jpg",
  },
  {
    id: "6",
    title: "Rally Control",
    type: TrainingType.technique,
    drills: 4,
    duration: "48 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869962_1280.jpg",
  },
  {
    id: "7",
    title: "Smash Training Camp",
    type: TrainingType.rally,
    drills: 8,
    duration: "28 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869963_1280.jpg",
  },
  {
    id: "8",
    title: "Looping Ladder",
    type: TrainingType.footwork,
    drills: 6,
    duration: "35 min",
    difficulty: "Advanced",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869964_1280.jpg",
  },
  {
    id: "9",
    title: "Power Shots",
    type: TrainingType.serve,
    drills: 6,
    duration: "40 min",
    difficulty: "Intermediate",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869965_1280.jpg",
  },
  {
    id: "10",
    title: "Footwork Flow",
    type: TrainingType.rally,
    drills: 8,
    duration: "43 min",
    difficulty: "Beginner",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/03/53/table-tennis-1869966_1280.jpg",
  },
];
