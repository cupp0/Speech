import Speech from "./Speech"
import Word from "./Word";
import Syllable from "./Syllable"
import Phoneme from "./Phoneme";
import SpeechPerfomance from "./SpeechPerformance"
import { Performer } from "./Performer";
import { loadAudioFiles } from "./audio";

const wordInput =
    document.getElementById("wordInput") as HTMLInputElement;

const speakButton =
    document.getElementById("speak") as HTMLButtonElement;

speakButton.addEventListener("click", updateSpeech);

let currentSpeech: Speech = new Speech(wordInput.value);
const performer: Performer = new Performer();
loadAudioFiles();

async function updateSpeech(){
    currentSpeech = new Speech(wordInput.value)
    performer.sing(currentSpeech, randomPerformance(currentSpeech));
}

function randomPerformance(speech: Speech): SpeechPerfomance{
    const words = speech.words;
    const sylls: Syllable[] = [];
    for (const w of words){
        for (const s of w.syllables){
            sylls.push(s);
        }
    }
    const durs: number[] = [];
    const pitches: number[] = [];
    const tempo: number = (Math.random() + 2) / 8

    // give each syllable a duration and pitch
    for (const s of sylls){
        //random number 1 to 4;
        durs.push(2)
        pitches.push(0)
    }

    return new SpeechPerfomance(durs, pitches, 1, tempo);
}

