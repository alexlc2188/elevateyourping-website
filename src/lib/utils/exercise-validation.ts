// Utility function to check if an exercise is ready to be published
export function getMissingFields(exercise: any): string[] {
  const missingFields: string[] = [];
  
  // Basic required fields
  const basicRequiredFields: { key: keyof typeof exercise; label: string }[] = [
    { key: "label", label: "Title" },
    { key: "practiceInstruction", label: "Practice Instructions" },
    { key: "duration", label: "Duration" },
    { key: "mainVideoId", label: "Main Video" },
    { key: "previewVideoId", label: "Preview Clip" },
    { key: "type", label: "Training Type" },
  ];

  // Check basic fields
  basicRequiredFields.forEach(({ key, label }) => {
    if (!exercise[key]) {
      missingFields.push(label);
    }
  });

  // Check for at least one tag - handle different data structures
  const hasTags = exercise.tags && (
    // Handle array of tag objects with id and name
    (Array.isArray(exercise.tags) && exercise.tags.some((tag: any) => tag.id || tag.name || tag.tag)) ||
    // Handle array of tag IDs
    (Array.isArray(exercise.tags) && exercise.tags.length > 0 && typeof exercise.tags[0] === 'string') ||
    // Handle object with tag relation
    (typeof exercise.tags === 'object' && Object.keys(exercise.tags).length > 0)
  );
  
  if (!hasTags) {
    missingFields.push("At least one tag");
  }

  // Check focus areas - handle different data structures
  const hasFocusArea = exercise.focusAreas && (
    // Handle array of focus area objects
    (Array.isArray(exercise.focusAreas) && exercise.focusAreas.some((fa: any) => fa.id || fa.label || fa.focusArea)) ||
    // Handle array of focus area IDs
    (Array.isArray(exercise.focusAreas) && exercise.focusAreas.length > 0 && typeof exercise.focusAreas[0] === 'string') ||
    // Handle object with focus area relation
    (typeof exercise.focusAreas === 'object' && Object.keys(exercise.focusAreas).length > 0)
  );
  
  if (!hasFocusArea) {
    missingFields.push("Focus Area");
  }

  // Check intensity score
  if (!exercise.intensityScore) {
    missingFields.push("Intensity Score");
  }

  // Check skill level
  if (!exercise.skillLevel) {
    missingFields.push("Skill Level");
  }

  return missingFields;
}

// Check if an exercise is ready to be published
export function isReadyToPublish(exercise: any): boolean {
  return getMissingFields(exercise).length === 0;
}
