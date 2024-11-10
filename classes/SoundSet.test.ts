import Fraction from "fraction.js";
import { SoundSet } from "./SoundSet";
import { expect, test, describe } from "bun:test";
import { errors } from "../lib";

describe("SoundSet", () => {
  const L = [new Fraction(1, 1), new Fraction(1, 3), new Fraction(1, 5)];
  const F = [new Fraction(1, 1), new Fraction(3, 1), new Fraction(5, 1)];

  const expectedL = ["1", "1/3", "1/5"];
  const expectedF = ["1", "3", "5"];

  const harmonicL = ["1", "1/2", "1/3", "1/4", "1/5"];
  const harmonicF = ["1", "2", "3", "4", "5"];

  test("Should construct empty frequency set", () => {
    const set = new SoundSet();

    expect(set.type).toEqual("frequency");
    expect(set.elements.size).toEqual(0);
  });

  test("Should construct from array", () => {
    const set = new SoundSet({ elements: F });

    expect(Array.from(set.elements.keys())).toEqual(expectedF);
  });

  test("Should construct wavelength from array", () => {
    const set = new SoundSet({ elements: L, type: "wavelength" });

    expect(Array.from(set.elements.keys())).toEqual(expectedL);
  });

  test("Should get correct keys", () => {
    const set = new SoundSet({ elements: F });

    expect(set.keys()).toEqual(expectedF);
  });

  test("Should get correct fractions", () => {
    const set = new SoundSet({ elements: F });

    set.fractions().forEach((fraction, i) => {
      expect(fraction.toFraction()).toEqual(expectedF[i]);
    });
  });

  test("Should add new fraction to set", () => {
    const set = new SoundSet({ elements: F });

    set.add(new Fraction(2, 1));

    set.fractions().forEach((fraction, i) => {
      expect(fraction.toFraction()).toEqual([...expectedF, "2"][i]);
    });
  });

  test("Should delete fraction from set", () => {
    const set = new SoundSet({ elements: F });

    expect(set.delete(new Fraction(3, 1))).toEqual(true);

    set.fractions().forEach((fraction, i) => {
      expect(fraction.toFraction()).toEqual(["1", "5"][i]);
    });
  });

  test("Should pop fraction from set", () => {
    const set = new SoundSet({ elements: F });

    const f = set.pop(new Fraction(3, 1));

    expect(f?.toFraction()).toEqual("3");
    set.fractions().forEach((fraction, i) => {
      expect(fraction.toFraction()).toEqual(["1", "5"][i]);
    });
  });

  test("Should check if fraction is in set", () => {
    const set = new SoundSet({ elements: F });

    expect(set.has(new Fraction(3, 1))).toEqual(true);
  });

  test("Should copy set", () => {
    const set = new SoundSet({ elements: F });

    const copy = set.copy();

    expect(set.keys()).toEqual(expectedF);

    set.delete(new Fraction(3, 1));

    expect(copy.keys()).toEqual(expectedF);
  });

  test("Should build set", () => {
    const set = new SoundSet();

    set.build({
      length: 3,
      builderFn: (i) => new Fraction(2 * i + 1, 1),
    });

    expect(set.keys()).toEqual(expectedF);
  });

  test("Should build harmonic frequency set", () => {
    const set = new SoundSet().harmonic(5);
    expect(set.keys()).toEqual(harmonicF);
  });

  test("Should build harmonic wavelength set", () => {
    const set = new SoundSet({ type: "wavelength" }).harmonic(5);
    expect(set.keys()).toEqual(harmonicL);
  });

  test("Should convert to different type", () => {
    const set = new SoundSet({ elements: F });

    const sameType = set.toFrequencies();

    expect(sameType.keys()).toEqual(expectedF);
    expect(sameType.type).toEqual("frequency");

    const otherType = set.toWavelengths();

    expect(otherType.keys()).toEqual(expectedL);
    expect(otherType.type).toEqual("wavelength");
  });

  test("Should convert to different type", () => {
    const set = new SoundSet({ elements: L, type: "wavelength" });

    expect(set.toWavelengths().keys()).toEqual(expectedL);
    expect(set.toFrequencies().keys()).toEqual(expectedF);
  });

  test("Should check if sets are equal", () => {
    const set1 = new SoundSet({ type: "wavelength", elements: L });
    const sameSetDifferentOrder = new SoundSet({
      type: "wavelength",
      elements: [new Fraction(1, 3), new Fraction(1, 5), new Fraction(1, 1)],
    });
    const sameElementsDifferentType = new SoundSet({
      type: "frequency",
      elements: L,
    });
    const set2 = new SoundSet({ type: "wavelength", elements: F });

    expect(set1.equal(set1)).toEqual(true);
    expect(set1.equal(sameSetDifferentOrder)).toEqual(true);
    expect(set1.equal(sameElementsDifferentType)).toEqual(false);
    expect(set1.equal(set2)).toEqual(false);
  });

  test("Should find intersection of sets", () => {
    const setF = new SoundSet({ elements: F });
    const setFNoIntersection = new SoundSet({
      elements: [new Fraction(2, 1), new Fraction(4, 1)],
    });
    const setFWithIntersection = new SoundSet({
      elements: [new Fraction(2, 1), new Fraction(3, 1)],
    });
    const setFWithIntersection2 = new SoundSet({
      elements: [new Fraction(5, 1), new Fraction(3, 1)],
    });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(
      setF.intersection([setFNoIntersection, setFWithIntersection]).keys()
    ).toEqual([]);

    expect(
      setF.intersection([setFWithIntersection, setFWithIntersection2]).keys()
    ).toEqual(["3"]);

    expect(() => setF.intersection([setFWithIntersection, setL])).toThrow(
      errors.intersectionWrongType
    );
  });

  test("Should find union of sets", () => {
    const setF = new SoundSet({ elements: F });
    const setFNoIntersection = new SoundSet({
      elements: [new Fraction(2, 1), new Fraction(4, 1)],
    });
    const setFWithIntersection = new SoundSet({
      elements: [new Fraction(5, 1), new Fraction(6, 1)],
    });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(
      setF.union([setFNoIntersection, setFWithIntersection]).keys()
    ).toEqual(["1", "3", "5", "2", "4", "6"]);

    expect(() => setF.union([setFNoIntersection, setL])).toThrow(
      errors.unionWrongType
    );
  });

  test("Should transpose individual element of set", () => {
    const setF = new SoundSet({ elements: F });
    setF.transposeElement("3", new Fraction(2, 1));

    expect(setF.keys()).toEqual(["1", "5", "6"]);

    const setL = new SoundSet({ type: "wavelength", elements: L });
    setL.transposeElement("1/3", new Fraction(2, 1));

    expect(setL.keys()).toEqual(["1", "1/5", "1/6"]);
  });

  test("Should transpose set", () => {
    const setF = new SoundSet({ elements: F });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    const transposedF = setF.toTransposed(new Fraction(2, 1));
    const transposedL = setL.toTransposed(new Fraction(2, 1));

    expect(transposedF.keys()).toEqual(["2", "6", "10"]);
    expect(transposedL.keys()).toEqual(["1/2", "1/6", "1/10"]);
  });

  test("Should find min element of the set", () => {
    const setF = new SoundSet({ elements: F });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(setF.min()?.toFraction()).toEqual("1");
    expect(setL.min()?.toFraction()).toEqual("1/5");
  });

  test("Should find min element of the set", () => {
    const setF = new SoundSet({ elements: F });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(setF.max()?.toFraction()).toEqual("5");
    expect(setL.max()?.toFraction()).toEqual("1");
  });

  test("Should find lcm of the set", () => {
    const setF = new SoundSet({ elements: F });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(setF.lcm()?.toFraction()).toEqual("15");
    expect(setL.lcm()?.toFraction()).toEqual("1");
  });

  test("Should find gcd of the set", () => {
    const setF = new SoundSet({ elements: F });
    const setL = new SoundSet({ type: "wavelength", elements: L });

    expect(setF.gcd()?.toFraction()).toEqual("1");
    expect(setL.gcd()?.toFraction()).toEqual("1/15");
  });

  test("Should get harmonic superset", () => {
    const setF = new SoundSet({ elements: F });
    expect(setF.getHarmonicSuperset().keys()).toEqual(harmonicF);

    const transposedF = setF.toTransposed(new Fraction(2, 1));
    expect(transposedF.getHarmonicSuperset().keys()).toEqual([
      "2",
      "4",
      "6",
      "8",
      "10",
    ]);

    transposedF.add(new Fraction(7, 1));
    expect(transposedF.getHarmonicSuperset().keys()).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ]);

    const setL = new SoundSet({ type: "wavelength", elements: L });
    expect(setL.getHarmonicSuperset().keys()).toEqual(harmonicL);

    const transposedL = setL.toTransposed(new Fraction(2, 1));
    expect(transposedL.getHarmonicSuperset().keys()).toEqual([
      "1/2",
      "1/4",
      "1/6",
      "1/8",
      "1/10",
    ]);

    transposedL.add(new Fraction(1, 7));
    expect(transposedL.getHarmonicSuperset().keys()).toEqual([
      "1",
      "1/2",
      "1/3",
      "1/4",
      "1/5",
      "1/6",
      "1/7",
      "1/8",
      "1/9",
      "1/10",
    ]);
  });
});
