import Phoneme from "../src/Phoneme"
import SpeechPerformance from "../src/SpeechPerformance"

export default class Vocalization {

    phoneme: Phoneme;
    performance: SpeechPerformance

  constructor(phoneme: Phoneme, performace: SpeechPerformance) {
    this.phoneme = phoneme;
    this.performance = performace;
  }

}