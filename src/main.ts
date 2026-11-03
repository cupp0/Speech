import Speech from "../src/Speech"
import { adjustSamplePitch, playSound, appendBuffers, adjustSampleLength } from "../src/audio"
import { loadAudioFiles, copyAudioBuffer, phonemeAudio } from "./audio";
import SpeechPerformance from "./SpeechPerformance";
import Phoneme from "./Phoneme";
import { phonemeTypes } from "../src/PhonemeTypes"


let currentSpeech: Speech;

loadAudioFiles();

const wordInput =
    document.getElementById("wordInput") as HTMLInputElement;

const speakButton =
    document.getElementById("speak") as HTMLButtonElement;

speakButton.addEventListener("click", playSpeech);

async function playSpeech(){
    currentSpeech = new Speech(wordInput.value)
    const buffers: AudioBuffer[] = [];
    for (const w of currentSpeech.words){
        for (const p of w.phonemes){
            let b = copyAudioBuffer(phonemeAudio.get(p.label)!);
            b = adjustSamplePitch(b, Math.random()*12 - 6)
            b = adjustSampleLength(b, Math.random())
            buffers.push(b);
        }
    }

    const sequence: AudioBuffer = appendBuffers(buffers);
    playSound(sequence);
}

// async function retrieveBuffers(phonemes:Phoneme[]): AudioBuffer[]{
//     await createSound(p, sp).then(buffer => {
//         const newBuffer = adjustSamplePitch(buffer, Math.random()*12 - 6)
//         buffers.push(newBuffer)
//     }); 
// }

// async function generateSpeechBuffer(): AudioBuffer{
//     const sp = new SpeechPerformance(1, 1, 1)
//     const phonemes: Phoneme[] = []

//     for (const w of currentSpeech.words){
//         for (const p of w.phonemes){
//             phonemes.push(p)
//         }
//     }

//     const buffers: AudioBuffer[] = retrieveBuffers(phonemes);
// }
