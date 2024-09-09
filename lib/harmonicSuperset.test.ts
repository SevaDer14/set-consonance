import * as HarmonicSuperset from "./harmonicSuperset";
import { expect, test, describe } from "bun:test";

describe("getHarmonicSuperset", () => {
  test("should return a same harmonic set", () => {
    expect(HarmonicSuperset.getHarmonicSuperset([1, 1 / 2, 1 / 3])).toEqual([
      1,
      1 / 2,
      1 / 3,
    ]);
  });

  test("should restore missing fundamental", () => {
    expect(HarmonicSuperset.getHarmonicSuperset([6, 4])).toEqual([12, 6, 4]);
  });

  test("should return harmonic superset", () => {
    expect(HarmonicSuperset.getHarmonicSuperset([1 / 5, 1 / 7])).toEqual([
      1,
      1 / 2,
      1 / 3,
      1 / 4,
      1 / 5,
      1 / 6,
      1 / 7,
    ]);
  });

  test("should return harmonic superset", () => {
    expect(HarmonicSuperset.getHarmonicSuperset([5, 3, 2])).toEqual([
      30,
      15,
      10,
      7.5,
      6,
      5,
      30 / 7,
      3.75,
      30 / 9,
      3,
      30 / 11,
      2.5,
      30 / 13,
      30 / 14,
      2,
    ]);
  });
});

describe("getHarmonicConsonance", () => {
  test("should return harmonic consonance of 1", () => {
    expect(HarmonicSuperset.getHarmonicConsonance([12, 6, 4])).toBe(1);
  });

  test("should return harmonic consonance", () => {
    expect(HarmonicSuperset.getHarmonicConsonance([1 / 5, 1 / 7])).toBe(2 / 7);
  });

  test("should return harmonic consonance", () => {
    expect(HarmonicSuperset.getHarmonicConsonance([5, 3, 2])).toEqual(0.2);
  });
});
