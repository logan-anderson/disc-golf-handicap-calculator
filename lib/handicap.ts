import { Course } from "./courses";

/**
 * Estimates the points per stroke scaling factor based on rating level.
 * The UDisc rating system has a nonlinear scale where better ratings
 * earn more points per stroke improvement.
 *
 * Known data points:
 * - Rating ~150: ~4 points per stroke
 * - Rating ~200: ~7 points per stroke
 * - Rating ~230: ~10-15 points per stroke (using conservative ~10)
 *
 * @param rating - The rating level to estimate scaling for
 * @returns Estimated points per stroke at this rating level
 */
function estimatePointsPerStroke(rating: number): number {
  // Use piecewise linear interpolation between known data points
  if (rating <= 150) {
    // Below 150, scale linearly from 2 points/stroke at 100 to 4 at 150
    return 2 + ((rating - 100) / 50) * 2;
  } else if (rating <= 200) {
    // Between 150-200: interpolate from 4 to 7 points/stroke
    const t = (rating - 150) / 50;
    return 4 + t * 3;
  } else if (rating <= 230) {
    // Between 200-230: interpolate from 7 to 10 points/stroke (using lower end of range)
    const t = (rating - 200) / 30;
    return 7 + t * 3; // Reduced from 5.5 to 3 for more conservative scaling
  } else {
    // Above 230: continue the trend more conservatively
    // Scale more gradually to avoid overestimating points per stroke
    const t = Math.min((rating - 230) / 50, 1); // Cap at 280
    return 10 + t * 5; // Reduced from 7.5 to 5 for more conservative scaling
  }
}

/**
 * Adjusts points per stroke based on the number of holes.
 * According to UDisc, layouts with fewer holes yield more points per stroke.
 * This adjustment accounts for the fact that fewer holes mean each stroke
 * has a greater impact on the overall round rating.
 *
 * @param basePointsPerStroke - Base points per stroke for the rating level
 * @param holes - Number of holes on the course
 * @returns Adjusted points per stroke accounting for course length
 */
function adjustForHoles(basePointsPerStroke: number, holes: number): number {
  // Normalize to 18 holes as baseline
  // Fewer holes = more impact per stroke = more points per stroke
  // Using a very conservative scaling factor to avoid unrealistic handicaps on shorter courses
  // For 9 holes: ~1.15x, for 18 holes: 1.0x
  const normalizationFactor = Math.pow(18 / holes, 0.2); // Further reduced from 0.25 to 0.2
  return basePointsPerStroke * normalizationFactor;
}

/**
 * Calculate the handicap for a given course and UDisc rating.
 *
 * The handicap represents how many strokes above or below the course rating
 * a player would typically score. A handicap of 0 means the player's rating
 * matches the course rating. A negative handicap indicates the player is
 * better than the course rating, while a positive handicap indicates they
 * would typically score higher.
 *
 * @param course - The selected disc golf course with parRating and holes
 * @param udiscRating - The player's UDisc rating
 * @returns The calculated handicap (rounded to nearest integer)
 */
export function calculateHandicap(
  course: Course,
  udiscRating: number
): number {
  const ratingDifference = udiscRating - course.parRating;

  // If ratings are equal, handicap is 0
  if (ratingDifference === 0) {
    return 0;
  }

  // Use the higher of the two ratings to determine scaling factor
  // This better reflects the skill level at which strokes are being measured
  const referenceRating = Math.max(udiscRating, course.parRating);
  const basePointsPerStroke = estimatePointsPerStroke(referenceRating);

  // Adjust for number of holes (fewer holes = more points per stroke)
  // Using a conservative scaling factor to avoid unrealistic handicaps
  const adjustedPointsPerStroke = adjustForHoles(
    basePointsPerStroke,
    course.holes
  );

  // Convert rating difference to strokes
  // Negative because: positive rating diff (better player) = negative handicap
  let handicapInStrokes = -ratingDifference / adjustedPointsPerStroke;

  // Cap handicaps to realistic maximums based on course length
  // For a 9-hole course, maximum practical handicap would be around -8 (all birdies) to -9 (all aces)
  // For 18 holes, maximum would be around -18 (all birdies)
  // Using a practical cap: course length * 0.9 for negative (better) handicaps
  // This prevents impossible handicaps that would require multiple aces
  const maxNegativeHandicap = -Math.floor(course.holes * 0.9);
  const maxPositiveHandicap = course.holes * 2; // Allow for reasonable positive handicaps

  handicapInStrokes = Math.max(maxNegativeHandicap, Math.min(maxPositiveHandicap, handicapInStrokes));

  // Round to nearest integer (handicaps are typically whole numbers)
  return Math.round(handicapInStrokes);
}
