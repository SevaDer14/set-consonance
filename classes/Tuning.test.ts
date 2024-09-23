import { Set } from "./Set";
import { expect, test, describe } from "bun:test";
import { Tuning } from "./Tuning";

describe("Tuning", () => {
  test("Should find tuning for harmonic set", () => {
    const set = new Set().harmonic(4);
    const context = set.copy();

    const tuning = new Tuning({ set, context });

    expect(tuning.toSorted()).toEqual([
      ["1", 1],
      ["1/2", 1],
      ["2", 1],
      ["1/3", 0.8333333333333334],
      ["2/3", 0.8333333333333334],
      ["3", 0.8333333333333334],
      ["3/2", 0.8333333333333334],
      ["1/4", 0.6875],
      ["3/4", 0.6875],
      ["4", 0.6875],
      ["4/3", 0.6875],
    ]);
  });
});
