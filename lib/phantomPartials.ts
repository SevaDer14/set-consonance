import { arrayDeepEqual, getLcm } from "./utils";

export function getNewSetsOfNextSize(elements: number[], sets: number[][]) {
  const newSets: number[][] = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < sets.length; j++) {
      if (sets[j].includes(elements[i])) continue;

      const newSet = [elements[i], ...sets[j]];
      if (!newSets.find((set) => arrayDeepEqual(newSet, set)))
        newSets.push(newSet);
    }
  }

  return newSets;
}

export function getAllSubsets(arr: number[]) {
  const subsets: Map<number[], null> = new Map();

  let subsetSize = 1;
  let subsetsOfSameLength: number[][] = arr.map((set) => [set]);

  while (subsetSize <= arr.length) {
    for (const subset of subsetsOfSameLength) {
      subsets.set(subset, null);
    }

    subsetsOfSameLength = getNewSetsOfNextSize(arr, subsetsOfSameLength);
    subsetSize++;
  }

  return Array.from(subsets.keys());
}

export function getPhantomPartialsSuperset(set: number[]) {
  const superset: number[] = [...set];
  const subsets = getAllSubsets(set);

  for (const subset of subsets) {
    const lcm = getLcm(subset);
    if (!superset.includes(lcm)) {
      superset.push(lcm);
    }
  }

  return superset;
}

export function getPhantomPartialsConsonance(set: number[]) {
  const superset = getPhantomPartialsSuperset(set);

  return set.length / superset.length;
}
