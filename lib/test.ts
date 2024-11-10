import Fraction from "fraction.js";
import type {
  AffinitiveTuning,
  Tuning,
  HarmonicTuning,
  SupersetTuning,
} from "../classes";
import { expect } from "bun:test";

export function assertTuning(
  tuning: Tuning | AffinitiveTuning | HarmonicTuning | SupersetTuning,
  expectedOutcome: [string, string][],
  affinityWeight = new Fraction(1, 2)
) {
  let i = 0;
  tuning.getIntervalConsonance(affinityWeight).forEach((consonance, key) => {
    expect([key, consonance.toFraction()]).toEqual(expectedOutcome[i]);
    i++;
  });
}
