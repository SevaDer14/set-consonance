import Fraction from "fraction.js";
import { Set } from "./Set";
import { getHarmonicity } from "../lib";


type ConstructorOptions = {
  set: Set;
  context: Set;
  affinityWeight?: number;
  harmonicityWeight?: number;
  minConsonance?: number;
};

export class Tuning {
  intervals: Map<string, number>;

  constructor({
    set,
    context,
    affinityWeight = 1,
    harmonicityWeight = 1,
    minConsonance = 0.2,
  }: ConstructorOptions) {
    const intervals = new Map<string, number>();
    const affinityTuning = this.getAffinityIntervals(set, context);

    for (const [interval, affinity] of affinityTuning) {
      const harmonicity = getHarmonicity(
        set.toShifted(new Fraction(interval)).union([context])
      ).valueOf();

      const totalConsonance =
        affinity * affinityWeight + harmonicity * harmonicityWeight;

      if (totalConsonance < minConsonance) continue;
      intervals.set(interval, totalConsonance > 1 ? 1 : totalConsonance);
    }

    this.intervals = intervals;
  }

  private getAffinityIntervals(set: Set, context: Set) {
    const affinityIntervals = new Map<string, number>();

    const intervals = this.getAllIntervals(set, context);
    const minSize = Math.min(set.fractions.size, context.fractions.size);

    for (const [interval, count] of intervals) {
      affinityIntervals.set(interval, count / minSize);
    }

    return affinityIntervals;
  }

  private getAllIntervals(set: Set, context: Set) {
    const intervals = new Map<string, number>();
    const setElements = set.elements();
    const contextElements = context.elements();

    for (let i = 0; i < setElements.length; i++) {
      for (let j = 0; j < contextElements.length; j++) {
        const interval = contextElements[j].div(setElements[i]).toFraction();

        if (intervals.has(interval)) {
          intervals.set(interval, intervals.get(interval)! + 1);
        } else {
          intervals.set(interval, 1);
        }
      }
    }

    return intervals;
  }

  public get(interval: Fraction | string) {
    if (typeof interval === "string") return this.intervals.get(interval);
    return this.intervals.get(interval.toFraction());
  }

  public toSorted() {
    return Array.from(this.intervals.entries()).sort((a, b) => b[1] - a[1]);
  }
}
