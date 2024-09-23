import Fraction from "fraction.js";
import { Set } from "../classes";
import * as Consonance from "./consonance";
import { expect, test, describe } from "bun:test";

describe("Consonance affinity", () => {
  test("Should find affinity of unison", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(1, 1));

    const affinity = Consonance.getAffinity(set1, set2);

    expect(affinity.toFraction()).toEqual("1");
  });

  test("Should find affinity of octave", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(1, 2));

    const affinity = Consonance.getAffinity(set1, set2);

    expect(affinity.toFraction()).toEqual("1/2");
  });

  test("Should find affinity of major third", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(5, 4));

    const affinity = Consonance.getAffinity(set1, set2);

    expect(affinity.toFraction()).toEqual("1/5");
  });

  test("Should find affinity of micro tone", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(101, 100));

    const affinity = Consonance.getAffinity(set1, set2);

    expect(affinity.toFraction()).toEqual("0");
  });
});

describe("Consonance harmonicity", () => {
  test("Should find harmonicity of unison", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(1, 1));

    const harmonicity = Consonance.getHarmonicity(set1.union([set2]));

    expect(harmonicity.toFraction()).toEqual("1");
  });

  test("Should find harmonicity of octave", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(1, 2));

    const harmonicity = Consonance.getHarmonicity(set1.union([set2]));

    expect(harmonicity.toFraction()).toEqual("3/4");
  });

  test("Should find harmonicity of major third", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(5, 4));

    const harmonicity = Consonance.getHarmonicity(set1.union([set2]));

    expect(harmonicity.toFraction()).toEqual("9/25");
  });

  test("Should find harmonicity of micro tone", () => {
    const set1 = new Set().harmonic(20);
    const set2 = set1.toShifted(new Fraction(101, 100));

    const harmonicity = Consonance.getHarmonicity(set1.union([set2]));

    expect(harmonicity.toFraction()).toEqual("2/101");
  });
});

describe("Consonance phantoms", () => {
  test("Should find phantom consonance of unison", () => {
    const set1 = new Set().harmonic(8);
    const set2 = set1.toShifted(new Fraction(1, 1));

    const consonance = Consonance.getPhantomFractionsConsonance(
      set1.union([set2])
    );

    expect(consonance.toFraction()).toEqual("1");
  });

  test("Should find phantom consonance of octave", () => {
    const set1 = new Set().harmonic(8);
    const set2 = set1.toShifted(new Fraction(1, 2));

    const consonance = Consonance.getPhantomFractionsConsonance(
      set1.union([set2])
    );

    expect(consonance.toFraction()).toEqual("1");
  });

  test("Should find phantom consonance of major third", () => {
    const set1 = new Set().harmonic(6);
    const set2 = set1.toShifted(new Fraction(5, 4));

    const consonance = Consonance.getPhantomFractionsConsonance(
      set1.union([set2])
    );

    expect(consonance.toFraction()).toEqual("11/15");
  });

  test("Should find phantom consonance of micro tone", () => {
    const set1 = new Set().harmonic(6);
    const set2 = set1.toShifted(new Fraction(101, 100));

    const consonance = Consonance.getPhantomFractionsConsonance(
      set1.union([set2])
    );

    expect(consonance.toFraction()).toEqual("2/3");
  });
});
