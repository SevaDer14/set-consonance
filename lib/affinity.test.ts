import * as Affinity from "./affinity";
import { expect, test, describe } from "bun:test";

describe("getIntersection", () => {
  test("Returns set2 as subset of set1", () => {
    expect(Affinity.getIntersection([1, 2, 3], [2, 3])).toEqual([2, 3]);
  });

  test("Returns empty set if no intersection", () => {
    expect(Affinity.getIntersection([1, 2, 3], [4, 5, 6])).toEqual([]);
  });

  test("Returns set1 if sets are equal but have different order", () => {
    expect(Affinity.getIntersection([7, 12, 3], [3, 7, 12])).toEqual([
      7, 12, 3,
    ]);
  });

  test("Returns correct intersection", () => {
    expect(
      Affinity.getIntersection(
        [21, 3.5, 8, 5, 33.127, 6, 77],
        [33.127, 7, 3.6, 21, 159]
      )
    ).toEqual([21, 33.127]);
  });
});

describe("getAffinity", () => {
  test("Returns 1 if set2 is subset of set1", () => {
    expect(Affinity.getAffinity([1, 2, 3], [2, 3])).toBe(1);
  });

  test("Returns 1 if set1 is subset of set2", () => {
    expect(Affinity.getAffinity([20, 30], [5, 30, 7, 20])).toBe(1);
  });

  test("Returns 0 if intersection is empty set", () => {
    expect(Affinity.getAffinity([1, 2, 3], [3.1, 4, 5])).toBe(0);
  });

  test("Returns correct affinity", () => {
    expect(
      Affinity.getAffinity([1, 2, 3, 4, 5, 6], [1.5, 3, 4.5, 6, 7.5, 9])
    ).toBe(2 / 6);
  });
});
