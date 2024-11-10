import Fraction from "fraction.js";
import { errors } from "../lib";

type ElementType = "frequency" | "wavelength";

export class SoundSet {
  type: ElementType;
  elements: Map<string, Fraction>;

  constructor(options = {} as { type?: ElementType; elements?: Fraction[] }) {
    this.type = options.type ?? "frequency";
    this.elements = new Map();

    if (!options.elements) return;

    for (const element of options.elements) {
      this.elements.set(this.createKey(element), element);
    }
  }

  private createKey(fraction: Fraction | string) {
    return typeof fraction === "string" ? fraction : fraction.toFraction();
  }

  private transpose(fraction: Fraction, interval: Fraction) {
    return this.type === "wavelength"
      ? fraction.div(interval)
      : fraction.mul(interval);
  }

  public keys() {
    return Array.from(this.elements.keys());
  }

  public fractions() {
    return Array.from(this.elements.values());
  }

  public add(fraction: Fraction) {
    const key = this.createKey(fraction);
    this.elements.set(key, fraction);

    return this;
  }

  public delete(fraction: Fraction | string) {
    const key = this.createKey(fraction);
    return this.elements.delete(key);
  }

  public pop(fraction: Fraction | string) {
    const key = this.createKey(fraction);
    const f = this.elements.get(key);

    if (f) {
      this.elements.delete(key);
      return f;
    }
  }

  public has(fraction: Fraction | string) {
    const key = this.createKey(fraction);
    return this.elements.has(key);
  }

  public copy() {
    return new SoundSet({
      type: this.type,
      elements: Array.from(this.elements.values()),
    });
  }

  public build({
    length,
    builderFn,
  }: {
    length: number;
    builderFn: (index: number) => Fraction;
  }) {
    for (let i = 0; i < length; i++) {
      this.add(builderFn(i));
    }

    return this;
  }

  public harmonic(length: number, fundamental = new Fraction(1)) {
    if (this.elements.size > 0) this.elements = new Map();

    if (this.type === "wavelength") {
      for (let i = 1; i <= length; i++) {
        this.add(new Fraction(1, i).mul(fundamental));
      }
    } else {
      for (let i = 1; i <= length; i++) {
        this.add(new Fraction(i, 1).mul(fundamental));
      }
    }

    return this;
  }

  public toFrequencies() {
    if (this.type === "frequency") return this.copy();

    const result = new SoundSet();

    for (const fraction of this.fractions()) {
      result.add(fraction.inverse());
    }

    return result;
  }

  public toWavelengths() {
    if (this.type === "wavelength") return this.copy();

    const result = new SoundSet({ type: "wavelength" });

    for (const fraction of this.fractions()) {
      result.add(fraction.inverse());
    }

    return result;
  }

  public equal(set: SoundSet) {
    if (set.type !== this.type) return false;
    if (set.elements.size !== this.elements.size) return false;

    for (const key of set.keys()) {
      if (!this.elements.has(key)) return false;
    }

    return true;
  }

  public intersection(sets: SoundSet[]) {
    for (const set of sets) {
      if (set.type !== this.type) throw new Error(errors.intersectionWrongType);
    }

    const result = new SoundSet({ type: this.type });

    for (const [key, fraction] of this.elements) {
      if (sets.reduce((acc, set) => acc && set.has(key), true)) {
        result.elements.set(key, fraction);
      }
    }

    return result;
  }

  public union(sets: SoundSet[]) {
    for (const set of sets) {
      if (set.type !== this.type) throw new Error(errors.unionWrongType);
    }

    const result = this.copy();

    for (const set of sets) {
      for (const [key, fraction] of set.elements) {
        if (!result.has(key)) {
          result.add(fraction);
        }
      }
    }

    return result;
  }

  public transposeElement(fraction: Fraction | string, interval: Fraction) {
    const f = this.pop(fraction);

    if (!f) return false;

    this.add(this.transpose(f, interval));

    return true;
  }

  public toTransposed(interval: Fraction) {
    const result = new SoundSet({ type: this.type });

    for (const fraction of this.fractions()) {
      result.add(this.transpose(fraction, interval));
    }

    return result;
  }

  public min() {
    let min: Fraction | undefined;

    this.elements.forEach((fraction) => {
      if (!min || fraction.compare(min) < 0) {
        min = fraction;
      }
    });

    return min;
  }

  public max() {
    let max: Fraction | undefined;

    this.elements.forEach((fraction) => {
      if (!max || fraction.compare(max) > 0) {
        max = fraction;
      }
    });

    return max;
  }

  public lcm() {
    let lcm: Fraction | undefined;

    this.elements.forEach((fraction) => {
      if (!lcm) {
        lcm = fraction;
      } else {
        lcm = fraction.lcm(lcm);
      }
    });

    return lcm;
  }

  public gcd() {
    let gcd: Fraction | undefined;

    this.elements.forEach((fraction) => {
      if (!gcd) {
        gcd = fraction;
      } else {
        gcd = fraction.gcd(gcd);
      }
    });

    return gcd;
  }

  public getHarmonicSuperset(additionalHarmonics = 0) {
    const superset = new SoundSet({ type: this.type });

    if (this.elements.size === 0) return superset;

    let fundamental: Fraction | undefined, numberOfPartials: number;

    if (this.type === "wavelength") {
      fundamental = this.lcm();
      const min = this.min();

      if (min === undefined || fundamental === undefined) return superset;

      numberOfPartials = fundamental.div(min).valueOf();
    } else {
      fundamental = this.gcd();
      const max = this.max();

      if (max === undefined || fundamental === undefined) return superset;

      numberOfPartials = max.div(fundamental).valueOf();
    }

    return superset.harmonic(numberOfPartials + additionalHarmonics, fundamental);
  }
}
