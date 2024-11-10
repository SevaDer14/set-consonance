import Fraction from "fraction.js";
import { getHarmonicity } from "../lib";
import { Fractions } from "./Fractions";
import { Tuning, type TuningConstructorOptions } from "./Tuning";

type AffinitiveTuningConstructorOptions = TuningConstructorOptions;

export class AffinitiveTuning extends Tuning {
  constructor(opts: AffinitiveTuningConstructorOptions) {
    super(opts);
  }

  constructIntervals() {
    const intervals = new Fractions();
    const affinityContribution = new Fractions();
    const harmonicityContribution = new Fractions();

    if (this.set.elements.size === 0 || this.contextSet.elements.size === 0)
      return [intervals, affinityContribution, harmonicityContribution];

    const affinityStep = new Fraction(1, this.set.elements.size);

    for (const contextFraction of this.contextSet.fractions()) {
      for (const setFraction of this.set.fractions()) {
        const interval = contextFraction.div(setFraction);
        const key = this.createKey(interval);

        if (!intervals.has(key)) {
          intervals.set(key, interval);
        }

        if (affinityContribution.has(key)) {
          const val: Fraction = affinityContribution.get(key);

          affinityContribution.set(key, val.add(affinityStep));
        } else {
          affinityContribution.set(key, affinityStep);
        }

        if (!harmonicityContribution.has(key)) {
          const transposed = this.set.toTransposed(interval);
          const intervalSet = this.contextSet.union([transposed]);

          harmonicityContribution.set(key, getHarmonicity(intervalSet));
        }
      }
    }

    return [intervals, affinityContribution, harmonicityContribution];
  }
}
