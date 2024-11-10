import Fraction from "fraction.js";
import { getAffinity, getHarmonicity } from "../lib";
import { Fractions } from "./Fractions";
import { Tuning, type TuningConstructorOptions } from "./Tuning";

type SupersetTuningConstructorOptions = TuningConstructorOptions & {
  additionalHarmonics?: number;
};

export class SupersetTuning extends Tuning {
  additionalHarmonics: number;

  constructor(opts = {} as SupersetTuningConstructorOptions) {
    super(opts);
    this.additionalHarmonics = opts.additionalHarmonics ?? 0;
  }

  constructIntervals(opts: SupersetTuningConstructorOptions) {
    const additionalHarmonics = opts.additionalHarmonics ?? 0
    const intervals = new Fractions();
    const affinityContribution = new Fractions();
    const harmonicityContribution = new Fractions();

    if (this.set.elements.size === 0 || this.contextSet.elements.size === 0)
      return [intervals, affinityContribution, harmonicityContribution];

    const harmonicContextSet = this.contextSet.getHarmonicSuperset(
      additionalHarmonics
    );

    const harmonicSet = this.set.getHarmonicSuperset(additionalHarmonics);

    for (const contextFraction of harmonicContextSet.fractions()) {
      for (const setFraction of harmonicSet.fractions()) {
        const interval = contextFraction.div(setFraction);
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
