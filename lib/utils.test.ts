import * as Utils from "./utils";
import { expect, test, describe } from "bun:test";

describe("remainder", () => {
  test("should return the remainder of two numbers", () => {
    expect(Utils.remainder(10, 3)).toBe(1);
    expect(Utils.remainder(10, 4)).toBe(2);
    expect(Utils.remainder(10, 5)).toBe(0);
    expect(Utils.remainder(1, 1 / 5)).toBe(0);
  });
});

describe("isLcm", () => {
  test("should return true for integers", () => {
    expect(Utils.isLcm(12, [2, 3, 4])).toBe(true);
  });

  test("should return true for floats", () => {
    expect(Utils.isLcm(1, [1 / 2, 1 / 3, 1 / 4, 1 / 6])).toBe(true);
  });

  test("should return true for close floats", () => {
    expect(Utils.isLcm(2, [1, 0.5, 0.33333])).toBe(true);
  });

  test("should return true for close floats with reduced precision", () => {
    expect(Utils.isLcm(2, [1, 0.5, 0.33], 0.1)).toBe(true);
  });

  test("should return false for integers", () => {
    expect(Utils.isLcm(12, [2, 3, 5])).toBe(false);
  });
});

describe("getLcm", () => {
  test("should return the correct LCM for integers", () => {
    expect(Utils.getLcm([2, 3, 4])).toBe(12);
  });

  test("should return the correct LCM for harmonic floats", () => {
    expect(Utils.getLcm([1 / 2, 1 / 3, 1 / 4, 1 / 5])).toBe(1);
  });

  test("should return the correct LCM for distant harmonic floats", () => {
    expect(Utils.getLcm([1 / 7, 1 / 9])).toBe(1);
  });

  test("should return the correct LCM for inharmonic floats", () => {
    expect(Utils.getLcm([1, 1.2, 5.3])).toBe(318);
  });
});

describe("arrayDeepEqual", () => {
  test("should return true for equal arrays", () => {
    expect(Utils.arrayDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test("should return true for equal arrays with different order", () => {
    expect(Utils.arrayDeepEqual([1, 2, 3, 7, 9], [9, 1, 2, 7, 3])).toBe(true);
  });

  test("should return false for different arrays", () => {
    expect(Utils.arrayDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });
});

