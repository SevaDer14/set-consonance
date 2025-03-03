import { expect, test, describe } from "bun:test";
import { getUnion, getHarmonicFrequencies } from "@/lib";
import { Tuning } from "@/classes";
import {
  tuningAffinitiveUnison,
  tuningAffinitiveFifth,
  tuningHarmonicSupersetFifth,
  tuningHarmonicUnison,
} from "./fixtures";

describe("classes/Tuning:", () => {
  test("Should find affinitive tuning", () => {
    const complement = getHarmonicFrequencies(3);
    const context = complement.copy();

    const tuning = new Tuning().getAffinitiveTuning({ context, complement });

    expect(tuning.toFractions()).toEqual(tuningAffinitiveUnison);
  });

  test("Should find affinitive tuning with fifth in context", () => {
    const complement = getHarmonicFrequencies(3);
    const context = getUnion([complement, complement.toTransposed("3/2")]);

    const tuning = new Tuning().getAffinitiveTuning({ context, complement });

    expect(tuning.toFractions()).toEqual(tuningAffinitiveFifth);
  });

  test("Should find harmonic superset tuning with fifth in context", () => {
    const complement = getHarmonicFrequencies(2);
    const context = getUnion([complement, complement.toTransposed("3/2")]);

    const tuning = new Tuning().getHarmonicSupersetTuning({
      context,
      complement,
    });

    expect(tuning.toFractions()).toEqual(tuningHarmonicSupersetFifth);
  });

  test("Should find harmonic tuning", () => {
    const complement = getHarmonicFrequencies(3);
    const context = getUnion([complement, complement.toTransposed("3/2")]);

    const tuning = new Tuning().getHarmonicTuning({
      complement,
      context,
      maxDenominator: 3,
      maxOctave: 1,
    });

    expect(tuning.toFractions()).toEqual(tuningHarmonicUnison);
  });
});
