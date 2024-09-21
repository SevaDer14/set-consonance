import Fraction from "fraction.js";

export class Set {
  fractions: Map<string, Fraction>;

  constructor(fractions?: Fraction[]) {
    this.fractions = new Map();

    if (fractions) {
      for (const fraction of fractions) {
        this.fractions.set(fraction.toFraction(), fraction);
      }
    }
  }

  public add(fraction: Fraction) {
    this.fractions.set(fraction.toFraction(), fraction);

    return this;
  }

  public delete(fraction: Fraction | string) {
    if (typeof fraction === "string") return this.fractions.delete(fraction);
    return this.fractions.delete(fraction.toFraction());
  }

  public pop(fraction: Fraction | string) {
    const key = typeof fraction === "string" ? fraction : fraction.toFraction();
    const f = this.fractions.get(key);

    if (f) {
      this.fractions.delete(key);
      return f;
    }
  }

  public has(fraction: Fraction | string) {
    if (typeof fraction === "string") return this.fractions.has(fraction);
    return this.fractions.has(fraction.toFraction());
  }

  public copy() {
    return new Set(Array.from(this.fractions.values()));
  }

  public elements() {
    return Array.from(this.fractions.values());
  }

  public build({
    length,
    builderFn,
  }: {
    length: number;
    builderFn: (index: number) => Fraction;
  }) {
    for (let i = 1; i <= length; i++) {
      this.add(builderFn(i));
    }

    return this;
  }

  public harmonic(length: number, fundamental = new Fraction(1)) {
    for (let i = 1; i <= length; i++) {
      this.add(new Fraction(1, i).mul(fundamental));
    }

    return this;
  }

  public equal(set: Set) {
    if (set.fractions.size !== this.fractions.size) return false;

    for (const [key] of set.fractions) {
      if (!this.fractions.has(key)) return false;
    }

    return true;
  }

  public intersection(sets: Set[]) {
    const result = new Set();

    for (const [key, fraction] of this.fractions) {
      if (sets.reduce((acc, set) => acc && set.has(key), true)) {
        result.fractions.set(key, fraction);
      }
    }

    return result;
  }

  public union(sets: Set[]) {
    const result = this.copy();

    for (const set of sets) {
      for (const [key, fraction] of set.fractions) {
        if (!result.has(key)) {
          result.fractions.set(key, fraction);
        }
      }
    }

    return result;
  }

  public shiftFraction(fraction: Fraction | string, interval: Fraction) {
    const f = this.pop(fraction);

    if (!f) return false;

    this.add(f.div(interval));

    return true;
  }

  public toShifted(interval: Fraction) {
    const result = new Set();

    for (const [key, fraction] of this.fractions) {
      result.add(fraction.div(interval));
    }

    return result;
  }

  public min() {
    let min: Fraction | undefined;

    this.fractions.forEach((fraction) => {
      if (!min || fraction.compare(min) < 0) {
        min = fraction;
      }
    });

    return min;
  }

  public lcm() {
    let lcm: Fraction | undefined;

    this.fractions.forEach((fraction) => {
      if (!lcm) {
        lcm = fraction;
      } else {
        lcm = fraction.lcm(lcm);
      }
    });

    return lcm;
  }

  public harmonicSuperset() {
    const superset = new Set();

    if (this.fractions.size === 0) return superset;

    const fundamental = this.lcm();
    const min = this.min();

    if (min === undefined || fundamental === undefined) return superset;

    const numberOfPartials = fundamental.div(min).valueOf();

    return superset.harmonic(numberOfPartials, fundamental);
  }

  private pairElementsToSets(elements: Fraction[], sets: Set[]): Set[] {
    const newSets: Set[] = [];

    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < sets.length; j++) {
        if (sets[j].has(elements[i])) continue;

        const newSet = sets[j].copy().add(elements[i]);

        if (!newSets.find((set) => set.equal(newSet))) newSets.push(newSet);
      }
    }

    return newSets;
  }

  private subsets() {
    const subsets: Set[] = [];

    let subsetSize = 0;
    const elements = this.elements();
    let subsetsOfSameLength: Set[] = [new Set()];

    while (subsetSize <= this.fractions.size) {
      for (const subset of subsetsOfSameLength) {
        subsets.push(subset);
      }

      subsetsOfSameLength = this.pairElementsToSets(
        elements,
        subsetsOfSameLength
      );
      subsetSize++;
    }

    return subsets;
  }

  public phantoms() {
    const phantoms = new Set();
    const subsets = this.subsets();

    for (const subset of subsets) {
      const lcm = subset.lcm();

      if (lcm && !this.has(lcm)) {
        phantoms.add(lcm);
      }
    }

    return phantoms;
  }
}
