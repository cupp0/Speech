export default class SpeechPerformance {

    duration: number;  // corresponding to ARPABET labels
    type: string;      // STATIC, DYNAMIC
    pitch: number;     // eventually a data list, currently distance in semitones from A440
    volume: number;    // eventually a list as well

  constructor(duration: number, pitch: number, volume: number) {
    this.duration = duration;
    this.type = "STATIC"
    this.pitch = Math.floor(Math.random() * 12) - 6;
    this.volume = 1;
  }


}