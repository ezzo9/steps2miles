import landmarksData from "@/data/landmarks.json";

// NOTE TO SELF: the distances in data/landmarks.json are a reasonable
// starting point (park loops, bridge crossings, race distances) but have
// not all been individually re-verified against a current source. Check
// them before this goes live, then keep expanding coverage as needed.

export type Landmark = {
  name: string;
  miles: number;
};

export const LANDMARKS: Landmark[] = landmarksData;

/**
 * Returns the `count` landmarks whose distance is closest to `miles`,
 * nearest first.
 */
export function findClosestLandmarks(miles: number, count = 2): Landmark[] {
  return [...LANDMARKS]
    .sort((a, b) => Math.abs(a.miles - miles) - Math.abs(b.miles - miles))
    .slice(0, count);
}
