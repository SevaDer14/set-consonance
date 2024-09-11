import {
  getHarmonicConsonance,
  getLcm,
  getPhantomPartialsConsonance,
  toPrecision,
} from "../lib";

/**
 * Any sound can be represented as a set of partials
 * each partial has a period (key) and amplitude (value)
 * Map is chosen over array as there cannot be two partials with same period
 * */
export class Sound {
  partials: Map<number, number>;

  constructor(input?: [number, number][]) {
    this.partials = new Map();

    if (input) {
      for (const [period, amplitude] of input) {
        this.addPartial(period, amplitude);
      }
    }
  }

  public getPeriods() {
    return Array.from(this.partials.keys());
  }

  public getPartials() {
    return Array.from(this.partials.entries());
  }

  public harmonic(length: number) {
    for (let i = 1; i <= length; i++) {
      this.addPartial(1 / i, 0);
    }

    return this;
  }

  public generate({
    length,
    generator,
  }: {
    length: number;
    generator: (index: number) => [number, number];
  }) {
    for (let i = 1; i <= length; i++) {
      this.addPartial(...generator(i));
    }

    return this;
  }

  public toNote(interval: number) {
    const result = new Sound();

    for (const [period, amplitude] of this.partials) {
      const newPeriod = toPrecision(period / interval);
      result.addPartial(newPeriod, amplitude);
    }

    return result;
  }

  public addSound(sound: Sound) {
    for (const [period, amplitude] of sound.partials) {
      this.addPartial(period, amplitude);
    }
  }

  public toChord(intervals: number[]) {
    const chord = new Sound();

    for (const interval of intervals) {
      const note = this.toNote(interval);
      chord.addSound(note);
    }

    return chord;
  }

  public getFundamental() {
    return getLcm(this.getPeriods());
  }

  public getHarmonicConsonance() {
    return getHarmonicConsonance(this.getPeriods());
  }

  public getPhantomPartialsConsonance() {
    return getPhantomPartialsConsonance(this.getPeriods());
  }

  private addPartial(period: number, amplitude: number) {
    const existingAmplitude = this.partials.get(period) ?? 0;

    this.partials.set(period, existingAmplitude + amplitude);
  }
}
