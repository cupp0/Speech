import Phoneme from "./Phoneme";
import EntryProtocol from "./EntryProtocol";
import ExitProtocol from "./ExitProtocol";
import OverlapProtocol from "./OverlapProtocol";

export default class TransitionProtocol{

    p1: Phoneme;
    p2: Phoneme;
    exit: ExitProtocol;   // type of fade out for first phoneme
    entry: EntryProtocol; // type of fade in for the second phoneme
    overlap: OverlapProtocol;      // amount the samples should overlap

    constructor(p1: Phoneme, p2: Phoneme){
        this.p1 = p1;
        this.p2 = p2;
        this.exit = this.determineExitProtocol();
        this.entry = this.determineEntryProtocol();
        this.overlap = this.determineOverlap();
    }

    // how quick should the first phoneme fade out
    determineExitProtocol(): ExitProtocol{
        let s: string = "";
        switch (this.p1.getType()+ "-" + this.p2.getType()){
            case "VOWEL-VOWEL": s = "LONG"
                break;
            case "VOWEL-PLOSIVE": s = "SHORT"
                break;
            case "VOWEL-LONG": s = "LONG"
                break;
            case "PLOSIVE-VOWEL": s = "MAX"
                break;
            case "PLOSIVE-PLOSIVE": s = "MAX"
                break;
            case "PLOSIVE-LONG": s = "MAX"
                break;
            case "LONG-VOWEL": s = "LONG"
                break;
            case "LONG-PLOSIVE": s = "SHORT"
                break;
            case "LONG-LONG": s = "LONG"
                break;
        }
        return new ExitProtocol(s);
    }

    determineEntryProtocol(): EntryProtocol{
        let s: string = "";
        switch (this.p1.getType()+ "-" + this.p2.getType()){
            case "VOWEL-VOWEL": s = "LONG"
                break;
            case "VOWEL-PLOSIVE": s = "SHORT"
                break;
            case "VOWEL-LONG": s = "LONG"
                break;
            case "PLOSIVE-VOWEL": s = "LONG"
                break;
            case "PLOSIVE-PLOSIVE": s = "SHORT"
                break;
            case "PLOSIVE-LONG": s = "LONG"
                break;
            case "LONG-VOWEL": s = "LONG"
                break;
            case "LONG-PLOSIVE": s = "SHORT"
                break;
            case "LONG-LONG": s = "LONG"
                break;
        }
        return new ExitProtocol(s);
    }

    // where does the second phoneme begin with respect to the beginning of the fade out 
    // of the first phoneme
    determineOverlap(): OverlapProtocol{

        let s: string = "";
        switch (this.p1.getType()+ "-" + this.p2.getType()){
            case "VOWEL-VOWEL": s = "START"
                break;
            case "VOWEL-PLOSIVE": s = "END"
                break;
            case "VOWEL-LONG": s = "START"
                break;
            case "PLOSIVE-VOWEL": s = "START"
                break;
            case "PLOSIVE-PLOSIVE": s = "START"
                break;
            case "PLOSIVE-LONG": s = "START"
                break;
            case "LONG-VOWEL": s = "START"
                break;
            case "LONG-PLOSIVE": s = "END"
                break;
            case "LONG-LONG": s = "START"
                break;
        }
        return new OverlapProtocol(s, this.exit.fadeType);

    }
}