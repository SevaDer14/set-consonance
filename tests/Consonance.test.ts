import { expect, test, describe } from "bun:test";
import { Consonance } from "@/classes";
import { getHarmonicFrequencies } from "@/lib";

const INTERVALS = {
  unison: "1/1",
  microTone: "101/100",
  majorThird: "5/4",
  fourth: "4/3",
  fifth: "3/2",
  octave: "2/1",
};

describe("classes/Consonance", () => {
  test("Should find consonance for unison", () => {
    const context = getHarmonicFrequencies(20);
    const complement = context.toTransposed(INTERVALS.unison);

    const consonance = new Consonance({ context, complement });

    expect(consonance.affinity.toFraction()).toEqual("1/2");
    expect(consonance.harmonicity.toFraction()).toEqual("1/2");
    expect(consonance.total.toFraction()).toEqual("1");
  });

  test("Should find harmonicity of different intervals", () => {
    const context = getHarmonicFrequencies(20);

    const octave = context.toTransposed(INTERVALS.octave);
    const majorThird = context.toTransposed(INTERVALS.majorThird);
    const microTone = context.toTransposed(INTERVALS.microTone);

    expect(
      new Consonance({ context, complement: octave }).harmonicity.toFraction()
    ).toEqual("3/8");

    expect(
      new Consonance({
        context,
        complement: majorThird,
      }).harmonicity.toFraction()
    ).toEqual("9/50");

    expect(
      new Consonance({
        context,
        complement: microTone,
      }).harmonicity.toFraction()
    ).toEqual("1/101");
  });

  test("Should find affinity of different intervals", () => {
    const context = getHarmonicFrequencies(20);

    const octave = context.toTransposed(INTERVALS.octave);
    const majorThird = context.toTransposed(INTERVALS.majorThird);
    const microTone = context.toTransposed(INTERVALS.microTone);

    expect(
      new Consonance({ context, complement: octave }).affinity.toFraction()
    ).toEqual("1/4");

    expect(
      new Consonance({ context, complement: majorThird }).affinity.toFraction()
    ).toEqual("1/10");

    expect(
      new Consonance({ context, complement: microTone }).affinity.toFraction()
    ).toEqual("0");
  });
});
