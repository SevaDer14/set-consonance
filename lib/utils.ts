import Fraction from "fraction.js";
import type { RationalNumber } from "./types";

export function parseRationalNumber(freq: RationalNumber): Fraction {
  if (freq instanceof Fraction) return freq;

  return new Fraction(freq);
}

