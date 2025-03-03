import type Fraction from "fraction.js";
import { FractionSet } from "./FractionSet";
import { Consonance } from "./Consonance";
import {
  getHarmonicSuperset,
  getKey,
  type ConsonancePair,
  type RationalNumber,
  type TuningDataItem,
} from "../lib";
import {
  getAffinitiveIntervals,
  getHarmonicItervals,
  type GetHarmonicIntervalsArgs,
} from "../lib/intervals";

export class Tuning {
  private _data = new Map() as Map<string, TuningDataItem>;
  public context = new FractionSet();
  public complement = new FractionSet();

  constructor(
    args = {} as Partial<ConsonancePair> & { intervals?: FractionSet }
  ) {
    if (args.context) this.context = args.context;
    if (args.complement) this.complement = args.complement;
    if (args.intervals) this.setTuningData(args.intervals);
  }

  get keys() {
    return this._data.keys();
  }

  get entries() {
    const result: [Fraction, Consonance][] = [];

    if (this._data.size === 0) return result;

    for (const key of this.keys) {
      const { interval, consonance } = this._data.get(key)!;

      result.push([interval, consonance]);
    }

    return result.sort((a, b) => a[0].compare(b[0]));
  }

  get(rNumber: RationalNumber) {
    return this._data.get(getKey(rNumber));
  }

  has(rNumber: RationalNumber) {
    return this._data.has(getKey(rNumber));
  }

  getHarmonicTuning({
    context,
    complement,
    ...rest
  }: Partial<ConsonancePair> & GetHarmonicIntervalsArgs) {
    if (context) this.context = context;
    if (complement) this.complement = complement;

    const intervals = getHarmonicItervals(rest);
    this.setTuningData(intervals);

    return this;
  }

  getAffinitiveTuning(args = {} as Partial<ConsonancePair>) {
    if (args.context) this.context = args.context;
    if (args.complement) this.complement = args.complement;

    const intervals = getAffinitiveIntervals({
      context: this.context,
      complement: this.complement,
    });

    this.setTuningData(intervals);

    return this;
  }

  getHarmonicSupersetTuning(args = {} as Partial<ConsonancePair>) {
    if (args.context) this.context = args.context;
    if (args.complement) this.complement = args.complement;

    const intervals = getAffinitiveIntervals({
      context: getHarmonicSuperset(this.context),
      complement: getHarmonicSuperset(this.complement),
    });

    this.setTuningData(intervals);

    return this;
  }

  toFileString() {
    return this.entries.map(([fraction, consonance]) => {
      const a = consonance.affinity.valueOf();
      const h = consonance.harmonicity.valueOf();

      return `${fraction.valueOf()}, ${
        1200 * Math.log2(fraction.valueOf())
      }, ${a}, ${h}, ${fraction.toFraction()}, ${a + h}`;
    }).join("\n");
  }

  toFractions() {
    return this.entries.map(([fraction, consonance]) => ({
      key: getKey(fraction),
      interval: fraction.toFraction(),
      affinity: consonance.affinity.toFraction(),
      harmonicity: consonance.harmonicity.toFraction(),
      total: consonance.total.toFraction(),
    }));
  }

  toDataPoints() {
    return this.entries.map(([fraction, consonance]) => ({
      key: getKey(fraction),
      interval: fraction.valueOf(),
      affinity: consonance.affinity.valueOf(),
      harmonicity: consonance.harmonicity.valueOf(),
      total: consonance.total.valueOf(),
    }));
  }

  private setTuningData(intervals: FractionSet) {
    this._data.clear();

    intervals.forEach((interval, key) => {
      this._data.set(key, {
        interval,
        consonance: new Consonance({
          context: this.context,
          complement: this.complement.toTransposed(interval),
        }),
      });
    });
  }
}
