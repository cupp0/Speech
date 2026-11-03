import Speech from "../src/Speech"
import { createSound } from "../src/audio"
import { adjustSamplePitch } from "../src/audio"
import { playSound } from "../src/audio"
import SpeechPerformance from "./SpeechPerformance";

let currentSpeech: Speech;

const wordInput =
    document.getElementById("wordInput") as HTMLInputElement;

const speakButton =
    document.getElementById("speak") as HTMLButtonElement;

speakButton.addEventListener("click", generateSpeech);

async function generateSpeech(){
    currentSpeech = new Speech(wordInput.value)
    const p = new SpeechPerformance(1, 1, 1)
    await createSound(currentSpeech.words[0].phonemes[0], p).then(buffer => {
        const newBuffer = adjustSamplePitch(buffer, 12)
        playSound(newBuffer)
    }); 
}
