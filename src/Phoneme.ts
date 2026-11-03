import { phonemeTypes } from "../src/PhonemeTypes"

export default class Phoneme {

    label: string;  // corresponding to ARPABET labels
    type: string;   // PLOSIVE, VOWEL, LONG

  constructor(label: string) {
    this.label = label;
    this.type = this.getType();
  }

  getType(): string{
    for (const type of phonemeTypes.keys()) {
        if (phonemeTypes.get(type)?.includes(this.label)) return type;
    }
    return "";
  }

}