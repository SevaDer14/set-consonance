import Fraction from "fraction.js";
import { SoundSet } from "./SoundSet";
import { test, describe } from "bun:test";
import { AffinitiveTuning } from "./AffinitiveTuning";
import { assertTuning } from "../lib";



describe("AffinitiveTuning", () => {
  const sine = new SoundSet().harmonic(1);
  const harmonic = new SoundSet().harmonic(3);
  const inharmonic = new SoundSet({
    elements: [new Fraction(2, 1), new Fraction(45, 10), new Fraction(52, 10)],
  });

  test("Should return correct sine tuning", () => {
    const tuning = new AffinitiveTuning({ set: sine, contextSet: sine });

    assertTuning(tuning, [["1", "1"]]);
  });

  test("Should return correct harmonic tuning", () => {
    const tuning = new AffinitiveTuning({
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

  test("Should return correct harmonic tuning only affinity contribution", () => {
    const tuning = new AffinitiveTuning({
      set: harmonic,
      contextSet: harmonic,
    });

    assertTuning(
      tuning,
      [
        ["1", "1"],
        ["1/2", "1/3"],
        ["1/3", "1/3"],
        ["2", "1/3"],
        ["2/3", "1/3"],
        ["3", "1/3"],
        ["3/2", "1/3"],
      ],
      new Fraction(1, 1)
    );
  });

  test("Should return correct inharmonic tuning", () => {
    const tuning = new AffinitiveTuning({
      set: inharmonic,
      contextSet: inharmonic,
    });

    assertTuning(tuning, [
      ["1", "55/104"],
      ["4/9", "161/936"],
      ["5/13", "691/4056"],
      ["9/4", "161/936"],
      ["45/52", "2719/16224"],
      ["13/5", "691/4056"],
      ["52/45", "2719/16224"],
    ]);
  });
});
