import * as Graph from "./graph";
import { expect, test, describe } from "bun:test";

describe("getGraph", () => {
  test("Returns correct graph integers", () => {
    const graph = Graph.getGraph({
      start: 0,
      end: 10,
      steps: 10,
      fn: (x) => x ** 2,
    });

    expect(graph).toEqual([
      [0, 0],
      [1, 1],
      [2, 4],
      [3, 9],
      [4, 16],
      [5, 25],
      [6, 36],
      [7, 49],
      [8, 64],
      [9, 81],
    ]);
  });

  test("Returns correct graph floats", () => {
    const graph = Graph.getGraph({
      start: 0,
      end: 1,
      steps: 10,
      fn: (x) => x ** 2,
    });

    expect(graph).toEqual([
      [0, 0],
      [0.1, 0.01],
      [0.2, 0.04],
      [0.3, 0.09],
      [0.4, 0.16],
      [0.5, 0.25],
      [0.6, 0.36],
      [0.7, 0.49],
      [0.8, 0.64],
      [0.9, 0.81],
    ]);
  });

  test("Can set precision", () => {
    const graph = Graph.getGraph({
      start: 1 / 3,
      end: 2 / 3,
      steps: 2,
      fn: (x) => x ** 2,
      precision: 1,
    });

    expect(graph).toEqual([
      [0, 0],
      [1, 0],
    ]);
  });
});
