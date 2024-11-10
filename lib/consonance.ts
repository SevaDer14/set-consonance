import Fraction from "fraction.js";
import { SoundSet } from "../classes";

export function getAffinity(set1: SoundSet, set2: SoundSet) {
  const [smallerSet, largerSet] =
    set1.elements.size < set2.elements.size ? [set1, set2] : [set2, set1];

  const intersection = smallerSet.intersection([largerSet]);

  return new Fraction(intersection.elements.size, smallerSet.elements.size);
}

export function getHarmonicity(set: SoundSet) {
  const superset = set.getHarmonicSuperset();

  return new Fraction(set.elements.size, superset.elements.size);
}
