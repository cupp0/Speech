import Phoneme from "../src/Phoneme"

export default class Syllable {

    phonemes: Phoneme[];

    constructor(phonemes: Phoneme[]) {
        this.phonemes = phonemes;
    }

}