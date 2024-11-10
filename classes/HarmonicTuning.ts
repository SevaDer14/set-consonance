import Fraction from "fraction.js";
import { getAffinity, getHarmonicity } from "../lib";
import { Tuning, type TuningConstructorOptions } from "./Tuning";
import { Fractions } from "./Fractions";

type HarmonicTuningConstructorOptions = TuningConstructorOptions & {
  precision: number;
};

export class HarmonicTuning extends Tuning {
  precision: number;

  constructor(opts: HarmonicTuningConstructorOptions) {
    super(opts);
    this.precision = opts.precision;
  }

  constructIntervals(opts: HarmonicTuningConstructorOptions) {
    const intervals = new Fractions();
    const affinityContribution = new Fractions();
    const harmonicityContribution = new Fractions();

    for (let numerator = 1; numerator <= opts.precision; numerator++) {
      for (let denominator = 1; denominator <= opts.precision; denominator++) {
        const interval = new Fraction(numerator, denominator);
        const key = this.createKey(interval);

        if (intervals.has(key)) continue;

        intervals.set(key, interval);

        const transposed = this.set.toTransposed(interval);
        const intervalSet = this.contextSet.copy().union([transposed]);

        harmonicityContribution.set(key, getHarmonicity(intervalSet));
        affinityContribution.set(key, getAffinity(this.contextSet, transposed));
      }
    }

    return [intervals, affinityContribution, harmonicityContribution];
  }
}
