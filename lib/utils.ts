import { DEFAULT_PRECISION, MAX_LCM_ITERATIONS } from "./constants";

// Consider proper division function
// Consider using real numbers
export function remainder(a: number, b: number, precision = DEFAULT_PRECISION) {
  if (a < b) throw new Error("a must be greater than b");
  if (a < 0 || b < 0) throw new Error("a and b must be positive");

  let remainders = [a];

  do {
    remainders.push(Math.abs(remainders.at(-1)! - b));
  } while (remainders.at(-1)! < remainders.at(-2)!);

  return toPrecision(remainders.at(-2)!, precision);
}

export function isLcm(
  lcm: number,
  divisors: number[],
  precision = DEFAULT_PRECISION
) {
  for (let i = 0; i < divisors.length; i++) {
    if (remainder(lcm, divisors[i]) > precision) return false;
  }

  return true;
}

export function getLcm(
  num: number[],
  precision = 0.01,
  maxMultiplier = MAX_LCM_ITERATIONS
) {
  const max = Math.max(...num);
  let multiplier = 1;
  let lcm = max;

  while (!isLcm(lcm, num, lcm * precision)) {
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

export function toPrecision(num: number, precision = DEFAULT_PRECISION) {
  return parseFloat(num.toFixed(Math.log10(1 / precision)));
}

export function hasCloseToPrecision(
  set: number[],
  num: number,
  precision = DEFAULT_PRECISION
) {
  for (const element of set) {
    if (Math.abs(element - num) < precision) return true;
  }

  return false;
}
