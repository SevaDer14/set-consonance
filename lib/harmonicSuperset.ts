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
  try {
    const superset = getHarmonicSuperset(set);

    if (set.length > superset.length) return 1

    return set.length / superset.length;
  } catch (error) {
    return 0;
  }
}
