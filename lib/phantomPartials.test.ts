import * as PhantomPartials from "./phantomPartials";
import { expect, test, describe } from "bun:test";

describe("getNewSetsOfNextSize", () => {
  test("should return all pairs of an array", () => {
    expect(
      PhantomPartials.getNewSetsOfNextSize(
        [1, 2],
        [
          [1, 3],
          [2, 3],
          [4, 5],
          [2, 6],
        ]
      )
    ).toEqual([
      [1, 2, 3],
      [1, 4, 5],
      [1, 2, 6],
      [2, 4, 5],
    ]);
  });
});

describe("getAllSubsets", () => {
  test("should return all subsets of an array", () => {
    expect(PhantomPartials.getAllSubsets([1, 2, 3])).toEqual([
      [1],
      [2],
      [3],
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 2, 3],
    ]);
  });

  test("should return all subsets of an array for floats", () => {
    expect(PhantomPartials.getAllSubsets([1.3, 315.2])).toEqual([
      [1.3],
      [315.2],
      [1.3, 315.2],
    ]);
  });

  test("should return all subsets of longer array", () => {
    expect(PhantomPartials.getAllSubsets([0, 5, 1, 10])).toEqual([
      [0],
      [5],
      [1],
      [10],
      [0, 5],
      [0, 1],
      [0, 10],
      [5, 1],
      [5, 10],
      [1, 10],
      [0, 5, 1],
      [0, 5, 10],
      [0, 1, 10],
      [5, 1, 10],
      [0, 5, 1, 10],
    ]);
  });
});

describe("Phantom partials superset", () => {
  test("should return a same harmonic set", () => {
    expect(
      PhantomPartials.getPhantomPartialsSuperset([1, 1 / 2, 1 / 3])
    ).toEqual([1, 1 / 2, 1 / 3]);
  });

  test("should restore missing fundamental", () => {
    expect(PhantomPartials.getPhantomPartialsSuperset([6, 4])).toEqual([
      6, 4, 12,
    ]);
  });

  test("should return phantom partials superset", () => {
    expect(PhantomPartials.getPhantomPartialsSuperset([5, 3, 2])).toEqual([
      5, 3, 2, 15, 10, 6, 30,
    ]);
  });
});

describe("Phantom partials consonance metric", () => {
  test("should return 1 for harmonic sound", () => {
    expect(
      PhantomPartials.getPhantomPartialsConsonance([12, 6, 4, 3, 2, 1])
    ).toBe(1);
  });

  test("should return 1 for square wave sound", () => {
    expect(
      PhantomPartials.getPhantomPartialsConsonance([
        1,
        1 / 3,
        1 / 5,
        1 / 7,
        1 / 9,
      ])
    ).toBe(1);
  });

  test("should return 1 for coherent harmonic sound", () => {
    expect(
      PhantomPartials.getPhantomPartialsConsonance([1, 1 / 3, 1 / 4])
    ).toBe(1);
  });

  test("should return less for harmonic with missing fundamental", () => {
    expect(
      PhantomPartials.getPhantomPartialsConsonance([6, 4, 3, 2, 1])
    ).toBeLessThan(1);
  });

  test("should return less for inharmonic sound", () => {
    expect(
      PhantomPartials.getPhantomPartialsConsonance([12, 6.1, 4, 3.3, 2, 1])
    ).toBeLessThan(0.5);
  });

  test("should return less for inharmonic sound", () => {
    expect(PhantomPartials.getPhantomPartialsConsonance([5, 3, 2])).toEqual(
      3 / 7
    );
  });
});
