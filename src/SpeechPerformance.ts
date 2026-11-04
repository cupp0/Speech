
//performance is over syllables for now
export default class SpeechPerformance {

    durations: number[];  // corresponding to ARPABET labels
    type: string;         // STATIC, DYNAMIC
    pitches: number[];    // eventually a data list, currently distance in semitones from A440
    volume: number;       // eventually a list as well
    tempo: number;        // a list too heck why not
  
    constructor(durations: number[], pitches: number[], volume: number, tempo: number) {
        this.durations = durations;
        this.type = "STATIC"
        this.pitches = pitches;
        this.volume = 1;
        this.tempo = tempo;
    }


}