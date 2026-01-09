import { Course } from "./courses";

/**
 * Calculate the handicap for a given course and UDisc rating.
 * TODO: Implement actual handicap calculation logic.
 *
 * @param course - The selected disc golf course
 * @param udiscRating - The player's UDisc rating
 * @returns The calculated handicap
 */
export function calculateHandicap(
  course: Course,
  udiscRating: number
): number {
  // Placeholder implementation - replace with actual handicap formula
  // This is a dummy calculation that you can update later
  return Math.round(udiscRating - course.parRating);
}
