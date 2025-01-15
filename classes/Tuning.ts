import Fraction from "fraction.js";
import { Set } from "./Set";
import { getConsonance } from "../lib";

type SortBy = "interval" | "consonance";

type HarmonicTuningOptions = {
  precision?: number;
  octaveSpan?: number;
};

const DEFAULT_HARMONIC_TUNING_OPTIONS: Required<HarmonicTuningOptions> = {
  precision: 100,
  octaveSpan: 1,
};

const DEFAULT_CONSTRUCTOR_OPTIONS = {
  affinityWeight: 0.5,
  harmonicityWeight: 0.5,
};

export class Tuning {
  intervals: Set;
  consonanceValues: Map<string, Fraction>;
  affinityWeight: number;
  harmonicityWeight: number;

  constructor(options = DEFAULT_CONSTRUCTOR_OPTIONS) {
    this.intervals = new Set();
    this.consonanceValues = new Map();
    this.affinityWeight = options.affinityWeight;
    this.harmonicityWeight = options.harmonicityWeight;
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

  harmonic(set1: Set, set2: Set, opt?: HarmonicTuningOptions) {
    const options = { ...DEFAULT_HARMONIC_TUNING_OPTIONS, ...(opt || {}) };

    this.intervals = new Set();
    const octaveTuning = new Set();

    for (let denominator = 1; denominator <= options.precision; denominator++) {
      for (
        let numerator = denominator;
        numerator <= denominator * 2;
        numerator++
      ) {
        octaveTuning.add(new Fraction(numerator, denominator));
      }
    }

    const octaveTunings: Set[] = [];

    for (
      let octave = options.octaveSpan;
      octave > -options.octaveSpan;
      octave--
    ) {
      const interval =
        octave > 0
          ? new Fraction(2 ** octave, 1)
          : new Fraction(1, 2 ** -octave);
      octaveTunings.push(octaveTuning.toShifted(interval));
    }

    this.intervals = this.intervals.union(octaveTunings);

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

  toFileFormat(options: { sortBy: SortBy }) {
    let items: [Fraction, number][] = [];

    this.intervals.fractions.forEach((fraction, key) => {
      const consonance = this.consonanceValues.get(key)?.valueOf();

      if (!consonance) return;

      items.push([fraction, consonance]);
    });

    items.sort((a, b) =>
      options.sortBy === "consonance" ? b[1] - a[1] : a[0].compare(b[0])
    );

    return items.map(([fraction, consonance]) => `${fraction.toFraction()}, ${fraction.valueOf()}, ${consonance}`).join("\n");
  }
}
