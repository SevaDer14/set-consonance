import Fraction from "fraction.js";
import { SoundSet } from "./SoundSet";
import { test, describe, expect } from "bun:test";
import { SupersetTuning } from "./SupersetTuning";
import { assertTuning } from "../lib";

describe("SupersetTuning", () => {
  const sine = new SoundSet().harmonic(1);
  const harmonic = new SoundSet().harmonic(3);
  const inharmonic = new SoundSet({
    elements: [new Fraction(2, 1), new Fraction(45, 10), new Fraction(52, 10)],
  });

  test("Should return correct sine tuning", () => {
    const tuning = new SupersetTuning({
      set: sine,
      contextSet: sine,
    });

    assertTuning(tuning, [["1", "1"]]);
  });

  test("Should extend sine tuning", () => {
    const tuning = new SupersetTuning({
      set: sine,
      contextSet: sine,
      additionalHarmonics: 2,
    });

    assertTuning(tuning, [
      ["1", "1"],
      ["1/2", "1/2"],
      ["1/3", "1/3"],
      ["2", "1/2"],
      ["2/3", "1/3"],
      ["3", "1/3"],
      ["3/2", "1/3"],
    ]);
  });

  test("Should return correct harmonic tuning", () => {
    const tuning = new SupersetTuning({
      set: harmonic,
      contextSet: harmonic,
    });

    assertTuning(tuning, [
      ["1", "1"],
      ["1/2", "7/12"],
      ["1/3", "4/9"],
      ["2", "7/12"],
      ["2/3", "4/9"],
      ["3", "4/9"],
      ["3/2", "4/9"],
    ]);
  });

  test("Should return correct extended tuning only affinity contribution", () => {
    const tuning = new SupersetTuning({
      set: sine,
      contextSet: sine,
      additionalHarmonics: 2,
    });

    assertTuning(
      tuning,
      [
        ["1", "1"],
        ["1/2", "0"],
        ["1/3", "0"],
        ["2", "0"],
        ["2/3", "0"],
        ["3", "0"],
        ["3/2", "0"],
      ],
      new Fraction(1, 1)
    );
  });

  test("Should return correct inharmonic tuning", () => {
    const tuning = new SupersetTuning({
      set: inharmonic,
      contextSet: inharmonic,
    });

    expect(tuning.intervals.size).toEqual(1659);
  });
});
