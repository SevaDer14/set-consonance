import Fraction from "fraction.js";
import { FractionSet } from "@/classes";
import { expect, test, describe } from "bun:test";

describe("classes/FractionSet", () => {
  test("Should construct empty set", () => {
    const set = new FractionSet();

    expect(set.size).toBe(0);
  });

  test("Should construct from Fraction array", () => {
    const set = new FractionSet([
      new Fraction(1, 22),
      new Fraction(3, 23),
      new Fraction(271, 10),
      new Fraction(5, 1),
    ]);

    expect(set.keys).toEqual(["1/22", "3/23", "5", "271/10"]);
  });

  test("Should construct from number array", () => {
    const set = new FractionSet([1, 3, 1.5, 22.1]);

    expect(set.keys).toEqual(["1", "3/2", "3", "221/10"]);
  });

  test("Should construct from string array", () => {
    const set = new FractionSet(["1", "3", "3/2", "17/18"]);

    expect(set.keys).toEqual(["17/18", "1", "3/2", "3"]);
  });

  test("Should build set with builder function", () => {
    const set = new FractionSet().build({
      length: 4,
      builderFn: (i) => 2 * (i - 1) + 1,
    });

    expect(set.keys).toEqual(["1", "3", "5", "7"]);
  });

  test("Should add frequency", () => {
    const set = new FractionSet();

    set.add(new Fraction(125));
    set.add(53.2);
    set.add("28/3");

    expect(set.keys).toEqual(["28/3", "266/5", "125"]);
  });

  test("Should delete fraction", () => {
    const set = new FractionSet([1, 2, 3, 4]);

    set.delete(new Fraction(1));
    set.delete("2");
    set.delete(4);

    expect(set.keys).toEqual(["3"]);
  });

  test("Should pop fraction", () => {
    const set = new FractionSet([1, 1.5, 3, 4]);

    const f = set.pop("3/2");

    expect(f?.equals(new Fraction(3, 2))).toEqual(true);
  });

  test("Should copy set", () => {
    const set = new FractionSet([1, 22, 34.1]);

    const setCopy = set.copy();

    expect(set).not.toBe(setCopy);
    expect(setCopy.keys).toEqual(["1", "22", "341/10"]);
  });

  test("Should check set equality", () => {
    const fractions = [1, 5, 7];

    const set = new FractionSet(fractions);
    const otherSet = new FractionSet(fractions);

    expect(set.equal(otherSet)).toBe(true);
  });

  test("Should check set inequality", () => {
    const set = new FractionSet([1, 5, 7]);
    const otherSet = new FractionSet([1, 4, 7]);

    expect(set.equal(otherSet)).toBe(false);
  });

  test("Should check if set contains fraction", () => {
    const set = new FractionSet([1, "3/2", 6]);

    expect(set.has(1.5)).toBe(true);
  });

  test("Should check if set does not contain fraction", () => {
    const set = new FractionSet([1, "3/2", 6]);

    expect(set.has(1)).toBe(true);
  });

  test("Should shift frequency", () => {
    const set = new FractionSet([2, 4, 6]);

    set.transposeElement("4", new Fraction(2, 1));

    expect(set.keys).toEqual(["2", "6", "8"]);
  });

  test("Should transpose on interval", () => {
    const original = new FractionSet([2, 4, 6]);
    const transposed = original.transpose(new Fraction(2, 1));

    expect(original).toBe(transposed);
    expect(transposed.keys).toEqual(["4", "8", "12"]);
  });

  test("Should return new set transposde on interval", () => {
    const original = new FractionSet([2, 4, 6]);
    const transposed = original.toTransposed(new Fraction(2, 1));

    expect(original).not.toBe(transposed);
    expect(transposed.keys).toEqual(["4", "8", "12"]);
  });

  test("Should find smallest fraction in set", () => {
    const set = new FractionSet([5, 2, 22]);

    expect(set.min()?.toFraction()).toEqual("2");
  });

  test("Should find largest fraction in set", () => {
    const set = new FractionSet([5, 2, 22]);

    expect(set.max()?.toFraction()).toEqual("22");
  });

  test("Should find lcm of the set", () => {
    const set = new FractionSet(["4/3", "9/8", "11/12"]);

    expect(set.lcm()?.toFraction()).toEqual("396");
  });

  test("Should find gcd of the set", () => {
    const set = new FractionSet([30, 40, 50]);

    expect(set.gcd()?.toFraction()).toEqual("10");
  });
});
