import Fraction from "fraction.js";
import { getKey, parseRationalNumber, type RationalNumber } from "../lib";

export class FractionSet {
  private _data: Map<string, Fraction> = new Map();

  constructor(rNumbers?: RationalNumber[]) {
    if (!rNumbers) return;

    for (const rNumber of rNumbers) {
      this.add(rNumber);
    }
  }

  get entries() {
    return Array.from(this._data.entries()).sort((a, b) => a[1].compare(b[1]));
  }

  get elements() {
    return this.entries.map((entry) => entry[1]);
  }

  get keys() {
    return this.entries.map((entry) => entry[0]);
  }

  get size() {
    return this._data.size;
  }

  public toString() {
    return this.keys.toString();
  }

  public has(rNumber: RationalNumber) {
    return this._data.has(getKey(rNumber));
  }

  public get(rNumber: RationalNumber) {
    return this._data.get(getKey(rNumber));
  }

  public add(rNumber: RationalNumber) {
    const f = parseRationalNumber(rNumber);
    this._data.set(f.toFraction(), f);

    return this;
  }

  public delete(rNumber: RationalNumber) {
    return this._data.delete(getKey(rNumber));
  }

  public pop(rNumber: RationalNumber) {
    const f = this.get(rNumber);

    if (f) {
      this.delete(f);
    }

    return f;
  }

  public copy() {
    return new FractionSet(this.elements);
  }

  public build({
    length,
    builderFn,
  }: {
    length: number;
    builderFn: (index: number) => RationalNumber;
  }) {
    for (let i = 1; i <= length; i++) {
      this.add(builderFn(i));
    }

    return this;
  }

  public equal(set: FractionSet): boolean {
    if (set.size !== this.size) return false;

    for (const key of this.keys) {
      if (!set.has(key)) return false;
    }

    return true;
  }

  public transposeElement(element: RationalNumber, interval: RationalNumber) {
    const f = this.pop(element);

    if (!f) return this;

    this.add(f.mul(interval));

    return this;
  }

  public transpose(interval: RationalNumber) {
    const int = parseRationalNumber(interval);
    const direction = int.compare(1);

    if (direction < 0) {
      for (let i = 0; i < this.size; i++) {
        this.transposeElement(this.elements[i], int);
      }
    } else {
      for (let i = this.size - 1; i >= 0; i--) {
        this.transposeElement(this.elements[i], int);
      }
    }

    return this;
  }

  public toTransposed(interval: RationalNumber) {
    const int = parseRationalNumber(interval);
    const result = new FractionSet();

    for (let i = 0; i < this.size; i++) {
      result.add(this.elements[i].mul(int));
    }

    return result;
  }

  public min() {
    let min: Fraction | undefined;

    for (const el of this.elements) {
      if (!min || el.compare(min) < 0) {
        min = el;
      }
    }

    return min;
  }

  public max() {
    let max: Fraction | undefined;

    for (const el of this.elements) {
      if (!max || el.compare(max) > 0) {
        max = el;
      }
    }

    return max;
  }

  public lcm() {
    let lcm: Fraction | undefined;

    for (const el of this.elements) {
      if (!lcm) {
        lcm = el;
      } else {
        lcm = el.lcm(lcm);
      }
    }

    return lcm;
  }

  public gcd() {
    let gcd: Fraction | undefined;

    for (const el of this.elements) {
      if (!gcd) {
        gcd = el;
      } else {
        gcd = el.gcd(gcd);
      }
    }

    return gcd;
  }

  public forEach(callbackFn: (value: Fraction, key: string) => void) {
    this._data.forEach(callbackFn);
  }
}
