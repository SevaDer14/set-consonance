import Fraction from "fraction.js";
import { Set } from "../classes";

export function getAffinity(set1: Set, set2: Set) {
  const [smallerSet, largerSet] =
    set1.fractions.size < set2.fractions.size ? [set1, set2] : [set2, set1];

  const intersection = smallerSet.intersection([largerSet]);

  return new Fraction(intersection.fractions.size, smallerSet.fractions.size);
}

export function getHarmonicConsonance(set: Set) {
  const superset = set.harmonicSuperset();

  return new Fraction(set.fractions.size, superset.fractions.size);
}

export function getPhantomFractionsConsonance(set: Set) {
  const phantoms = set.phantoms();

  return new Fraction(
    set.fractions.size,
    set.fractions.size + phantoms.fractions.size
  );
}
