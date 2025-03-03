import Fraction from "fraction.js";
import { FractionSet } from "../classes";
import type { ConsonancePair } from "./types";

export type GetHarmonicIntervalsArgs = { maxDenominator: number; maxOctave: number }

export function getHarmonicItervals(
  args = {} as GetHarmonicIntervalsArgs
) {
  const intervals = new FractionSet();
  const maxOctave = args.maxOctave ?? 3;
  const maxDenominator = args.maxDenominator ?? 60;

  for (let octaveIndex = 0; octaveIndex < maxOctave; octaveIndex++) {
    for (let denominator = 1; denominator <= maxDenominator; denominator++) {
      for (
        let numerator = denominator;
        numerator <= denominator * 2;
        numerator++
      ) {
        const octave = new Fraction(2).pow(octaveIndex);
        const interval = new Fraction(numerator, denominator).mul(octave);

        intervals.add(interval);
        intervals.add(interval.inverse());
      }
    }
  }

  return intervals;
}

export function getAffinitiveIntervals(args: ConsonancePair) {
  const intervals = new FractionSet();

  for (let i = 0; i < args.context.size; i++) {
    for (let j = 0; j < args.complement.size; j++) {
      const interval = args.context.elements[i].div(
        args.complement.elements[j]
      );

      intervals.add(interval);
    }
  }

  return intervals;
}
