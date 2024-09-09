import { toPrecision } from "./utils";

type Graph = [number, number][];

type GetSweepArgs = {
  start: number;
  end: number;
  steps: number;
  fn: (x: number) => number;
  precision?: number;
};

export function getGraph(args: GetSweepArgs): Graph {
  const result: Graph = [];

  for (let i = 0; i < args.steps; i++) {
    const step = ((args.end - args.start) * i) / args.steps;
    const x = args.start + step;

    result.push([
      toPrecision(x, args.precision),
      toPrecision(args.fn(x), args.precision),
    ]);
  }

  return result;
}
