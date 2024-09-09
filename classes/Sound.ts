import { getLcm } from "../lib";

/**
 * Any sound can be represented as a set of partials
 * each partial has a period (key) and amplitude (value)
 * Map is chosen over array as there cannot be two partials with same period
 * */
export class Sound {
  partials: Map<number, number>;

  constructor() {
    this.partials = new Map();
  }

  public getPeriods() {
    return Array.from(this.partials.keys());
  }

  private addPartial(period: number, amplitude: number) {
    const existingAmplitude = this.partials.get(period) ?? 0;

    this.partials.set(period, existingAmplitude + amplitude);
  }

  public harmonic(length: number) {
    for (let i = 1; i <= length; i++) {
      this.addPartial(1 / i, 0);
    }
  }

  public generate({
    length,
    generator,
  }: {
    length: number;
    generator: (index: number) => [number, number];
  }) {
    for (let i = 0; i < length; i++) {
      this.addPartial(...generator(i));
    }
  }

  public toNote(notePeriod: number) {
    const result = new Sound();

    for (const [period, amplitude] of this.partials) {
      result.addPartial(notePeriod * period, amplitude);
    }

    return result;
  }

  public addSound(sound: Sound) {
    for (const [period, amplitude] of sound.partials) {
      this.addPartial(period, amplitude);
    }
  }

  public toChord(periods: number[]) {
    const chord = new Sound();

    for (const period of periods) {
      const note = this.toNote(period);
      chord.addSound(note);
    }

    return chord;
  }

  // HARMONIC ANALYSIS

  public getFundamental() {
    return getLcm(this.getPeriods());
  }

  private getHarmonicEquivalent() {

  }

  public getHarmonicConsonance() {
    
  }
}
