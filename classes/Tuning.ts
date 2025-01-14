import Fraction from "fraction.js";
import { Set } from "./Set";
import { getAffinity, getConsonance, getHarmonicity } from "../lib";

type HarmonicTuningOptions = {
  precision: number;
};

const DEFAULT_HARMONIC_TUNING_OPTIONS: HarmonicTuningOptions = {
  precision: 100,
};

export class Tuning {
  intervals: Set;
  consonanceValues: Map<string, Fraction>;
  affinityWeight: number;
  harmonicityWeight: number;

  constructor({ affinityWeight = 0.5, harmonicityWeight = 0.5 }) {
    this.intervals = new Set();
    this.consonanceValues = new Map();
    this.affinityWeight = affinityWeight;
    this.harmonicityWeight = harmonicityWeight;
  }

  affinitive(set1: Set, set2: Set) {
    this.intervals = new Set();

    const set1Elements = set1.elements();
    const set2Elements = set2.elements();

    for (let i = 0; i < set1Elements.length; i++) {
      for (let j = 0; j < set2Elements.length; j++) {
        const interval = set2Elements[j].div(set1Elements[i]);

        this.intervals.add(interval);
      }
    }

    this.intervals.fractions.forEach((fraction, key) => {
      this.consonanceValues.set(
        key,
        getConsonance(
          set1.toShifted(fraction),
          set2,
          this.affinityWeight,
          this.harmonicityWeight
        )
      );
    });

    return this;
  }

  harmonic(set1: Set, set2: Set, options = DEFAULT_HARMONIC_TUNING_OPTIONS) {
    this.intervals = new Set();
    const octaveTuning = new Set();

    for (let i = 0; i < options.precision; i++) {
      octaveTuning.add(new Fraction(options.precision + i, options.precision));
    }

    this.intervals.union([
      octaveTuning.toShifted(new Fraction(1, 2)),
      octaveTuning,
    ]);

    this.intervals.fractions.forEach((fraction, key) => {
      this.consonanceValues.set(
        key,
        getConsonance(
          set1.toShifted(fraction),
          set2,
          this.affinityWeight,
          this.harmonicityWeight
        )
      );
    });

    return this;
  }

  superset(set1: Set, set2: Set) {
    return this.affinitive(set1.harmonicSuperset(), set2.harmonicSuperset());
  }
}
