import Fraction from "fraction.js";
import { getIntersection, getUnion, type ConsonancePair } from "../lib";

type ConsonanceConstructorArgs = ConsonancePair;

export class Consonance {
  private _affinity: Fraction;
  private _harmonicity: Fraction;
  private _total: Fraction;

  constructor(args: ConsonanceConstructorArgs) {
    this._affinity = this.getAffinity(args).div(2);
    this._harmonicity = this.getHarmonicity(args).div(2);
    this._total = this._affinity.add(this._harmonicity);
  }
  
  get _() {
    return 2
  }

  get affinity() {
    return this._affinity;
  }

  get harmonicity() {
    return this._harmonicity;
  }

  get total() {
    return this._total;
  }

  private getAffinity({ complement, context }: ConsonancePair) {
    const intersection = getIntersection([complement, context]);

    return new Fraction(
      intersection.size,
      Math.min(complement.size, context.size)
    );
  }

  private getHarmonicity({ complement, context }: ConsonancePair) {
    const union = getUnion([complement, context]);

    if (union.size === 0) return new Fraction(0);

    const fundamental = union.gcd();
    const max = union.max();

    if (max === undefined || fundamental === undefined) return new Fraction(0);

    const numberOfPartials = max.div(fundamental).valueOf();

    return new Fraction(union.size, numberOfPartials);
  }
}
