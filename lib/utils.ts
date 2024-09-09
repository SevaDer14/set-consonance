import { DEFAULT_PRECISION, MAX_LCM_ITERATIONS } from "./constants";

export function remainder(a: number, b: number) {
  return a - Math.floor(a / b) * b;
}

export function isLcm(lcm: number, divisors: number[], precision = DEFAULT_PRECISION) {
  for (let i = 0; i < divisors.length; i++) {
    if (remainder(lcm, divisors[i]) > precision) return false;
  }

  return true;
}

export function getLcm(
  num: number[],
  precision = DEFAULT_PRECISION,
  maxMultiplier = MAX_LCM_ITERATIONS
) {
  const max = Math.max(...num);
  let multiplier = 1;
  let lcm = max;

  while (!isLcm(lcm, num, precision)) {
    if (multiplier > maxMultiplier) throw new Error("LCM not found");
    multiplier++;
    lcm = max * multiplier;
  }

  return lcm;
}

export function arrayDeepEqual(arr1: number[], arr2: number[]) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) return false;
  }

  return true;
}
