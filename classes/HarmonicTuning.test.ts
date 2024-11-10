import Fraction from "fraction.js";
import { SoundSet } from "./SoundSet";
import { test, describe } from "bun:test";
import { HarmonicTuning } from "./HarmonicTuning";
import { assertTuning } from "../lib";

describe("HarmonicTuning", () => {
  const sine = new SoundSet().harmonic(1);
  const harmonic = new SoundSet().harmonic(3);
  const inharmonic = new SoundSet({
    elements: [new Fraction(2, 1), new Fraction(45, 10), new Fraction(52, 10)],
  });

  test("Should return correct sine tuning", () => {
    const tuning = new HarmonicTuning({
      set: sine,
      contextSet: sine,
      precision: 3,
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
    const tuning = new HarmonicTuning({
      set: harmonic,
      contextSet: harmonic,
      precision: 3,
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

  test("Should return correct harmonic tuning only affinity contribution", () => {
    const tuning = new HarmonicTuning({
      set: harmonic,
      contextSet: harmonic,
      precision: 3,
    });

    assertTuning(
      tuning,
      [
        ["1", "1"],
        ["1/2", "5/6"],
        ["1/3", "5/9"],
        ["2", "5/6"],
        ["2/3", "5/9"],
        ["3", "5/9"],
        ["3/2", "5/9"],
      ],
      new Fraction(0, 1)
    );
  });

  test("Should return correct inharmonic tuning", () => {
    const tuning = new HarmonicTuning({
      set: inharmonic,
      contextSet: inharmonic,
      precision: 3,
    });

    assertTuning(tuning, [
      ["1", "55/104"],
      ["1/2", "3/104"],
      ["1/3", "1/52"],
      ["2", "3/104"],
      ["2/3", "1/52"],
      ["3", "1/52"],
      ["3/2", "1/52"],
    ]);
  });
});
