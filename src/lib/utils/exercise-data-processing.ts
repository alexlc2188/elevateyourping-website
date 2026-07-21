/**
 * Utility functions for processing exercise data
 * These functions help transform data between different formats and structures
 */

/**
 * Process tags from various data structures into an array of tag IDs
 * @param tags Tags in various formats (relation objects, direct IDs, etc.)
 * @returns Array of tag IDs
 */
export function processTags(tags: any): string[] {
  if (!tags) return [];
  
  // Handle array of objects with tag relation
  if (Array.isArray(tags) && tags.length > 0) {
    return tags.map((tagRel: any) => {
      // If it has a tag property (relation), extract the ID
      if (tagRel.tag && tagRel.tag.id) {
        return tagRel.tag.id;
      }
      // If it's already a tag ID
      if (tagRel.id) {
        return tagRel.id;
      }
      // If it's a tag ID string
      if (typeof tagRel === 'string') {
        return tagRel;
      }
      return null;
    }).filter(Boolean);
  }
  return [];
}

/**
 * Process focus areas from various data structures into an array of focus area IDs
 * @param focusAreas Focus areas in various formats (relation objects, direct IDs, etc.)
 * @returns Array of focus area IDs
 */
export function processFocusAreas(focusAreas: any): string[] {
  if (!focusAreas) return [];
  
  // Handle array of objects with focusArea relation
  if (Array.isArray(focusAreas) && focusAreas.length > 0) {
    return focusAreas.map((focusRel: any) => {
      // If it has a focusArea property (relation), extract the ID
      if (focusRel.focusArea && focusRel.focusArea.id) {
        return focusRel.focusArea.id;
      }
      // If it's already a focus area ID
      if (focusRel.id) {
        return focusRel.id;
      }
      // If it's a focus area ID string
      if (typeof focusRel === 'string') {
        return focusRel;
      }
      return null;
    }).filter(Boolean);
  }
  return [];
}

/**
 * Extract tag names from tag relations for display
 * @param tags Tag relations
 * @returns Array of tag names
 */
export function getTagNames(tags: any): string[] {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.map((tagRel: any) => {
      if (tagRel.tag && tagRel.tag.name) {
        return tagRel.tag.name;
      }
      if (tagRel.name) {
        return tagRel.name;
      }
      return '';
    }).filter(Boolean);
  }
  return [];
}

/**
 * Extract focus area names from focus area relations for display
 * @param focusAreas Focus area relations
 * @returns Array of focus area names
 */
export function getFocusAreaNames(focusAreas: any): string[] {
  if (!focusAreas) return [];
  
  if (Array.isArray(focusAreas)) {
    return focusAreas.map((focusRel: any) => {
      if (focusRel.focusArea && focusRel.focusArea.name) {
        return focusRel.focusArea.name;
      }
      if (focusRel.name) {
        return focusRel.name;
      }
      return '';
    }).filter(Boolean);
  }
  return [];
}
