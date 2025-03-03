import type Fraction from "fraction.js";
import type { Consonance, FractionSet } from "../classes";

export type RationalNumber = Fraction | string | number;

export type ConsonancePair = {
  context: FractionSet;
  complement: FractionSet;
};

export type TuningDataItem = { interval: Fraction; consonance: Consonance }
export type TuningDataPoint = [Fraction, Consonance]
