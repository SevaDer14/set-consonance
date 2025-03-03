import { expect, test, describe } from "bun:test";
import {
  getHarmonicItervals,
  getAffinitiveIntervals,
  getHarmonicFrequencies,
  getUnion,
} from "@/lib";

describe("lib/intervals.ts:", () => {
  test("Should find harmonic intervals", () => {
    const intervals = getHarmonicItervals({
      maxDenominator: 3,
      maxOctave: 1,
    });

    expect(intervals.keys).toEqual([
      "1/2",
      "3/5",
      "2/3",
      "3/4",
      "1",
      "4/3",
      "3/2",
      "5/3",
      "2",
    ]);
  });

  test("Should find harmonic intervals with another set of args", () => {
    const intervals = getHarmonicItervals({
      maxDenominator: 2,
      maxOctave: 2,
    });

    expect(intervals.keys).toEqual([
      "1/4",
      "1/3",
      "1/2",
      "2/3",
      "1",
      "3/2",
      "2",
      "3",
      "4",
    ]);
  });

  test("Should find affinitive intervals for unison", () => {
    const complement = getHarmonicFrequencies(3);
    const unison = complement.copy();

    const intervals = getAffinitiveIntervals({
      context: unison,
      complement,
    });

    expect(intervals.keys).toEqual(["1/3", "1/2", "2/3", "1", "3/2", "2", "3"]);
  });

  test("Should find affinitive intervals for fifth", () => {
    const complement = getHarmonicFrequencies(3);
    const unison = complement.copy();
    const fifth = unison.toTransposed("3/2");

    const intervals = getAffinitiveIntervals({
      context: getUnion([unison, fifth]),
      complement,
    });

    expect(intervals.keys).toEqual([
      "1/3",
      "1/2",
      "2/3",
      "3/4",
      "1",
      "3/2",
      "2",
      "9/4",
      "3",
      "9/2",
    ]);
  });
});
