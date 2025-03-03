import { expect, test, describe } from "bun:test";
import { FractionSet } from "@/classes";
import {
  getIntersection,
  getUnion,
  getHarmonicFrequencies,
  getHarmonicSuperset,
} from "@/lib";


describe("lib/sets.ts:", () => {
  test("Should find intersection", () => {
    const intersection = getIntersection([
      new FractionSet([1, 20, 43]),
      new FractionSet([20, "21/2"]),
      new FractionSet([43, 20]),
    ]);

    expect(intersection.keys).toEqual(["20"]);
  });

  test("Should return empty set of no intersection", () => {
    const intersection = getIntersection([
      new FractionSet([1, 20, 43]),
      new FractionSet([20, "21/2"]),
      new FractionSet([43, 1]),
    ]);

    expect(intersection.keys).toEqual([]);
  });

  test("Should find union", () => {
    const intersection = getUnion([
      new FractionSet([1, 20, 43]),
      new FractionSet([20, "21/2"]),
      new FractionSet([43, 20]),
    ]);

    expect(intersection.keys).toEqual([
      "1",
      "21/2",
      "20",
      "43",
    ]);
  });

  test("Should build harmonic set", () => {
    const set = getHarmonicFrequencies(5);

    expect(set.keys).toEqual(["1", "2", "3", "4", "5"]);
  });

  test("Should build harmonic set with custom fundamental", () => {
    const set = getHarmonicFrequencies(4, 100);

    expect(set.keys).toEqual(["100", "200", "300", "400"]);
  });

  test("Should find harmonic superset", () => {
    const set = new FractionSet([6, 7]);

    expect(getHarmonicSuperset(set).keys).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
    ]);
  });
});
