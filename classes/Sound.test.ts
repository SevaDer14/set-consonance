import { getAffinity } from "../lib";
import { Sound } from "./Sound";
import { expect, test, describe } from "bun:test";

describe("Sound utils", () => {
  const HARMONIC: [number, number][] = [
    [1, 1],
    [0.5, 0.5],
    [0.3333, 0.3333],
    [0.25, 0.25],
    [0.2, 0.2],
  ];

  test("Should construct empty sound", () => {
    const sound = new Sound();

    expect(sound.partials.size).toBe(0);
  });

  test("Should generate harmonic sound of 6 partials", () => {
    const sound = new Sound().harmonic(6);

    expect(sound.getPartials()).toEqual([
      [1, 0],
      [1 / 2, 0],
      [1 / 3, 0],
      [1 / 4, 0],
      [1 / 5, 0],
      [1 / 6, 0],
    ]);
  });

  test("Should generate sound with generator", () => {
    const sound = new Sound().generate({
      length: 4,
      generator: (i) => [i, i / 2],
    });

    expect(sound.getPartials()).toEqual([
      [1, 1 / 2],
      [2, 2 / 2],
      [3, 3 / 2],
      [4, 4 / 2],
    ]);
  });

  test("Should construct from array", () => {
    const input: [number, number][] = [
      [1, 22],
      [0.3, 2.3],
      [2.71, 0.1],
      [5, 0],
    ];
    const sound = new Sound(input);

    expect(sound.getPartials()).toEqual(input);
  });

  test("Should transpose to note", () => {
    const sound = new Sound(HARMONIC);
    const note = sound.toNote(2);

    expect(sound.getPartials()).toEqual(HARMONIC);
    expect(note.getPartials()).toEqual([
      [0.5, 1],
      [0.25, 0.5],
      [0.167, 0.3333],
      [0.125, 0.25],
      [0.1, 0.2],
    ]);
  });

  test("Should form 2 note chord", () => {
    const sound = new Sound(HARMONIC);
    const note = sound.toChord([1, 4 / 3]);

    expect(sound.getPartials()).toEqual(HARMONIC);
    expect(note.getPartials()).toEqual([
      [1, 1],
      [0.5, 0.5],
      [0.333, 0.3333],
      [0.25, 0.5832999999999999],
      [0.2, 0.2],
      [0.75, 1],
      [0.375, 0.5],
      [0.188, 0.25],
      [0.15, 0.2],
    ]);
  });

  test("Should form 3 note chord", () => {
    const sound = new Sound(HARMONIC);
    const note = sound.toChord([1, 4 / 3, 2]);

    expect(sound.getPartials()).toEqual(HARMONIC);
    expect(note.getPartials()).toEqual([
      [1, 1],
      [0.5, 1.5],
      [0.333, 0.3333],
      [0.25, 1.0833],
      [0.2, 0.2],
      [0.75, 1],
      [0.375, 0.5],
      [0.188, 0.25],
      [0.15, 0.2],
      [0.167, 0.3333],
      [0.125, 0.25],
      [0.1, 0.2],
    ]);
  });
});

describe("Sound harmonic consonance", () => {
  test("Should determine harmonic consonance of fifth", () => {
    const sound = new Sound().harmonic(6).toChord([1, 3 / 2]);

    expect(sound.getHarmonicConsonance().toFixed(2)).toBe("0.56");
  });

  test("Should determine harmonic consonance of fourth", () => {
    const sound = new Sound().harmonic(6).toChord([1, 4 / 3]);

    expect(sound.getHarmonicConsonance().toFixed(2)).toBe("0.46");
  });

  test("Should determine harmonic consonance of major chord", () => {
    const sound = new Sound().harmonic(6).toChord([1, 5 / 4, 2]);

    expect(sound.getHarmonicConsonance().toFixed(2)).toBe("0.29");
  });

  test("Should determine harmonic consonance of micro interval", () => {
    const sound = new Sound().harmonic(6).toChord([1, 1.001]);

    expect(sound.getHarmonicConsonance()).toBe(1);
  });
});

describe("Sound phantom partial consonance", () => {
  test("Should determine phantom partial consonance of fifth", () => {
    const sound = new Sound().harmonic(6).toChord([1, 3 / 2]);

    expect(sound.getPhantomPartialsConsonance().toFixed(2)).toBe("0.56");
  });

  test("Should determine phantom partial consonance of fourth", () => {
    const sound = new Sound().harmonic(6).toChord([1, 4 / 3]);

    expect(sound.getPhantomPartialsConsonance().toFixed(2)).toBe("0.50");
  });

  // SLOW TEST
  test("Should determine phantom partial consonance of major chord", () => {
    const sound = new Sound().harmonic(6).toChord([1, 5 / 4, 2]);

    expect(sound.getPhantomPartialsConsonance().toFixed(2)).toBe("0.29");
  });

  test("Should determine phantom partial consonance of micro interval", () => {
    const sound = new Sound().harmonic(6).toChord([1, 1.001]);
    expect(sound.getPhantomPartialsConsonance().toFixed(2)).toBe("1.00");
  });
});

describe("Sound affinity", () => {
  test("Should determine affinity of unison", () => {
    const sound = new Sound().harmonic(12);
    const rootNote = sound.getPeriods();
    const unison = sound.toNote(1).getPeriods();

    expect(getAffinity(rootNote, unison)).toBe(1);
  });

  test("Should determine affinity of octave", () => {
    const sound = new Sound().harmonic(12);
    const rootNote = sound.getPeriods();
    const octave = sound.toNote(2).getPeriods();

    expect(getAffinity(rootNote, octave)).toBe(0.5);
  });

  test("Should determine affinity of fifth", () => {
    const sound = new Sound().harmonic(12);
    const rootNote = sound.getPeriods();
    const fifth = sound.toNote(3 / 2).getPeriods();

    expect(getAffinity(rootNote, fifth)).toBe(1 / 3);
  });

  test("Should determine affinity of third", () => {
    const sound = new Sound().harmonic(12);
    const rootNote = sound.getPeriods();
    const third = sound.toNote(5 / 4).getPeriods();

    expect(getAffinity(rootNote, third).toFixed(2)).toBe("0.17");
  });

  test("Should determine affinity of major triad", () => {
    const sound = new Sound().harmonic(12);
    const fifth = sound.toChord([1, 3 / 2]).getPeriods();
    const thirdDegree = sound.toNote(5 / 4).getPeriods();

    expect(getAffinity(fifth, thirdDegree)).toBe(1 / 3);
  });
});
