import Fraction from "fraction.js";
import { parseRationalNumber } from ".";
import { FractionSet } from "../classes";
import type { RationalNumber } from "./types";

export function getKey(rNumber: RationalNumber) {
  return parseRationalNumber(rNumber).toFraction();
}

export function getIntersection(sets: FractionSet[]): FractionSet {
  const result = new FractionSet();

  if (sets.length === 0) return result;

  const rest = sets.slice(1);

  for (let [key, fraction] of sets[0].entries) {
    if (rest.reduce((acc, set) => acc && set.has(key), true)) {
      result.add(fraction);
    }
  }

  return result;
}

export function getUnion(sets: FractionSet[]): FractionSet {
  const result = new FractionSet();

  if (sets.length === 0) return result;

  for (const set of sets) {
    for (const f of set.elements) {
      if (!result.has(f)) result.add(f);
    }
  }

  return result;
}

export function getHarmonicFrequencies(
  size: RationalNumber,
  fundamental = 1 as RationalNumber
) {
  const result = new FractionSet();
  const length = parseRationalNumber(size).floor().valueOf();

  for (let i = 1; i <= length; i++) {
    result.add(new Fraction(i).mul(fundamental));
  }

  return result;
}

export function getHarmonicSuperset(set: FractionSet, extraPartials = 0) {
  const superset = new FractionSet();

  if (set.size === 0) return superset;

  const fundamental = set.gcd();
  const max = set.max();

  if (max === undefined || fundamental === undefined) return superset;

  const numberOfPartials = max.div(fundamental).valueOf() + extraPartials;

  return getHarmonicFrequencies(numberOfPartials, fundamental);
}
