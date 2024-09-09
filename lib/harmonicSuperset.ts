import { getLcm } from "./utils";

export function getHarmonicSuperset(set: number[]) {
  const superset = [];
  const fundamental = getLcm(set);
  const numberOfPartials = fundamental / Math.min(...set);

  for (let i = 1; i <= numberOfPartials; i++) {
    superset.push(fundamental / i);
  }

  return superset;
}

export function getHarmonicConsonance(set: number[]) {
  const superset = getHarmonicSuperset(set);

  return set.length / superset.length;;
}
