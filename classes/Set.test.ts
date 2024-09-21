// import { getAffinity } from "../lib";
import Fraction from "fraction.js";
import { Set } from "./Set";
import { expect, test, describe } from "bun:test";

describe("Set", () => {
  test("Should construct empty set", () => {
    const set = new Set();

    expect(set.fractions.size).toBe(0);
  });

  test("Should construct from array", () => {
    const input: Fraction[] = [
      new Fraction(1, 22),
      new Fraction(3, 23),
      new Fraction(271, 10),
      new Fraction(5, 1),
    ];
    const set = new Set(input);

    expect(Array.from(set.fractions.keys())).toEqual([
      "1/22",
      "3/23",
      "271/10",
      "5",
    ]);
  });

  test("Should build harmonic set", () => {
    const set = new Set().harmonic(5);

    expect(Array.from(set.fractions.keys())).toEqual([
      "1",
      "1/2",
      "1/3",
      "1/4",
      "1/5",
    ]);
  });

  test("Should build harmonic set", () => {
    const set = new Set().harmonic(4, new Fraction(12));

    expect(Array.from(set.fractions.keys())).toEqual(["12", "6", "4", "3"]);
  });

  test("Should build set with builder function", () => {
    const set = new Set().build({
      length: 4,
      builderFn: (i) => new Fraction(1, 2 * (i - 1) + 1),
    });

    expect(Array.from(set.fractions.keys())).toEqual([
      "1",
      "1/3",
      "1/5",
      "1/7",
    ]);
  });

  test("Should add fraction", () => {
    const set = new Set();
    set.add(new Fraction(1, 3));
    set.add(new Fraction(2, 3));

    expect(Array.from(set.fractions.keys())).toEqual(["1/3", "2/3"]);
  });

  test("Should delete fraction", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    set.delete(new Fraction(2, 3));
    set.delete("1/3");

    expect(Array.from(set.fractions.keys())).toEqual(["4/3"]);
  });

  test("Should pop fraction", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const f = set.pop("2/3");

    expect(f?.equals(new Fraction(2, 3))).toEqual(true);
  });

  test("Should copy set", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const setCopy = set.copy();

    expect(set).not.toBe(setCopy);
    expect(Array.from(setCopy.fractions.keys())).toEqual(["1/3", "2/3", "4/3"]);
  });

  test("Should list elements", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];
    const set = new Set(fractions);

    const elements = set.elements();
    elements.forEach((element, index) => {
      expect(element.equals(fractions[index])).toBe(true);
    });
  });

  test("Should check set equality", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];
    const set = new Set(fractions);
    const otherSet = new Set(fractions);

    expect(set.equal(otherSet)).toBe(true);
  });

  test("Should check set inequality", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];

    const set = new Set(fractions);

    const otherSet = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(5, 3),
    ]);

    expect(set.equal(otherSet)).toBe(false);
  });

  test("Should list set elements", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];
    const set = new Set(fractions);
    const elements = set.elements();
    elements.forEach((element, index) => {
      expect(element.equals(fractions[index])).toBe(true);
    });
  });

  test("Should check if set contains fraction", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];
    const set = new Set(fractions);

    expect(set.has(new Fraction(1, 3))).toBe(true);
  });

  test("Should check if set does not contain fraction", () => {
    const fractions = [
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ];
    const set = new Set(fractions);

    expect(set.has(new Fraction(1, 4))).toBe(false);
  });

  test("Should find intersection", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const intersection = set.intersection([
      new Set([new Fraction(1, 2), new Fraction(1, 3)]),
      new Set([new Fraction(4, 2), new Fraction(4, 3), new Fraction(1, 3)]),
    ]);

    expect(Array.from(intersection.fractions.keys())).toEqual(["1/3"]);
  });

  test("Should return empty set if no intersection", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const intersection = set.intersection([
      new Set([new Fraction(1, 2), new Fraction(2, 3)]),
      new Set([new Fraction(4, 2), new Fraction(4, 3), new Fraction(1, 2)]),
    ]);

    expect(Array.from(intersection.fractions.keys())).toEqual([]);
  });

  test("Should find union", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const union = set.union([
      new Set([new Fraction(1, 2), new Fraction(1, 3)]),
      new Set([new Fraction(4, 2), new Fraction(4, 3), new Fraction(1, 3)]),
    ]);

    expect(Array.from(union.fractions.keys())).toEqual([
      "1/3",
      "2/3",
      "4/3",
      "1/2",
      "2",
    ]);
  });

  test("Should shift fraction", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    set.shiftFraction("2/3", new Fraction(2, 1));

    expect(Array.from(set.fractions.keys())).toEqual(["1/3", "4/3"]);
  });

  test("Should shift on interval", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(2, 3),
      new Fraction(4, 3),
    ]);

    const result = set.toShifted(new Fraction(2, 1));

    expect(Array.from(result.fractions.keys())).toEqual(["1/6", "1/3", "2/3"]);
  });

  test("Should find smallest fraction in set", () => {
    const set = new Set([
      new Fraction(2, 3),
      new Fraction(1, 3),
      new Fraction(4, 3),
    ]);

    expect(set.min()?.toFraction()).toEqual("1/3");
  });

  test("Should find lcm of the set", () => {
    const set = new Set([
      new Fraction(1, 3),
      new Fraction(1, 4),
      new Fraction(1, 5),
    ]);

    expect(set.lcm()?.toFraction()).toEqual("1");
  });

  test("Should find lcm of the set", () => {
    const set = new Set([
      new Fraction(4, 3),
      new Fraction(9, 8),
      new Fraction(11, 12),
    ]);

    expect(set.lcm()?.toFraction()).toEqual("396");
  });

  test("Should find harmonic superset", () => {
    const set = new Set([new Fraction(1, 4), new Fraction(1, 5)]);

    expect(Array.from(set.harmonicSuperset().fractions.keys())).toEqual([
      "1",
      "1/2",
      "1/3",
      "1/4",
      "1/5",
    ]);
  });

  test("Should find harmonic superset", () => {
    const set = new Set([new Fraction(1), new Fraction(9, 8)]);

    expect(Array.from(set.harmonicSuperset().fractions.keys())).toEqual([
      "9",
      "9/2",
      "3",
      "9/4",
      "9/5",
      "3/2",
      "9/7",
      "9/8",
      "1",
    ]);
  });

  test("Should find phantom fractions", () => {
    const set = new Set([new Fraction(1, 3), new Fraction(1, 7)]);

    expect(Array.from(set.phantoms().fractions.keys())).toEqual(["1"]);
  });

  test("Should find phantom fractions", () => {
    const set = new Set([
      new Fraction(9, 8),
      new Fraction(3, 7),
      new Fraction(2, 5),
    ]);

    expect(Array.from(set.phantoms().fractions.keys())).toEqual([
      "9",
      "18",
      "6",
    ]);
  });
});
