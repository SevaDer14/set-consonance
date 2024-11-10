import Fraction from "fraction.js";
import { SoundSet } from "./SoundSet";
import { errors, type Point } from "../lib";
import { Fractions } from "./Fractions";

export type TuningConstructorOptions = {
  contextSet: SoundSet;
  set: SoundSet;
};

export class Tuning {
  intervals: Fractions;
  affinityContribution: Fractions;
  harmonicityContribution: Fractions;
  contextSet: SoundSet;
  set: SoundSet;

  constructor(opts: TuningConstructorOptions) {
    if (opts.set !== opts.contextSet) throw new Error(errors.tuningWrongType);

    this.set = opts.set;
    this.contextSet = opts.contextSet;

    [this.intervals, this.affinityContribution, this.harmonicityContribution] =
      this.constructIntervals(opts);
  }

  createKey(f: Fraction) {
    return f.toFraction();
  }

  constructIntervals(opts: any) {
    const intervals = new Fractions();
    const affinityContribution = new Fractions();
    const harmonicityContribution = new Fractions();

    return [intervals, affinityContribution, harmonicityContribution];
  }

  getConsonance(
    key: string,
    affinityWeight = new Fraction(1, 2),
    harmonicityWeight = new Fraction(1, 2)
  ): Fraction {
    const a: Fraction = this.affinityContribution.get(key) ?? new Fraction(0);
    const h: Fraction =
      this.harmonicityContribution.get(key) ?? new Fraction(0);

    const affinity = a.mul(affinityWeight);
    const harmonicity = h.mul(harmonicityWeight);

    return affinity.add(harmonicity);
  }

  getIntervalConsonance(affinityWeight = new Fraction(1, 2)) {
    const result = new Fractions();
    const harmonicityWeight = new Fraction(1, 1).sub(affinityWeight);
    
    this.intervals.forEach((interval, key) => {
      result.set(key, this.getConsonance(key, affinityWeight, harmonicityWeight));
    });

    return result;
  }

  getPlotData(affinityWeight = new Fraction(1, 2)) {
    const result: Point[] = [];
    const harmonicityWeight = new Fraction(1, 1).sub(affinityWeight);

    this.intervals.forEach((interval, key) => {
      result.push([
        interval.valueOf(),
        this.getConsonance(key, affinityWeight, harmonicityWeight).valueOf(),
      ]);
    });

    return result.sort((a, b) => a[0] - b[0]);
  }
}
