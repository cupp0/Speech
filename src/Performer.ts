import Speech from "./Speech"
import Syllable from "./Syllable";
import {playSound, createAudioBuffer, phonemeAudio, copyAudioBuffer, fadeIn, fadeOut, getFadeFromMax, adjustSamplePitch, adjustSampleLength} from "./audio"
import TransitionProtocol from "./TransitionProtocol";
import Phoneme from "./Phoneme";
import SpeechPerformance from "./SpeechPerformance";

export class Performer{

    constructor(){}
    
    sing(speech: Speech, performance: SpeechPerformance){

        // make sequence of relevant phonemes
        const phonemeSequence: Phoneme[] = [];
        for (const w of speech.words){
            for (const p of w.phonemes){
                phonemeSequence.push(p);
            }
        }

        // get buffer sequence 
        const buffers: AudioBuffer[] = [];
        for (const p of phonemeSequence){
            buffers.push(copyAudioBuffer(phonemeAudio.get(p.label)!))
        }
       
        // and transition sequence
        const transitions: TransitionProtocol[] = [];
        for (let i = 0; i < phonemeSequence.length-1; i++){
            transitions.push(new TransitionProtocol(phonemeSequence[i], phonemeSequence[i+1]));
        }

        // get syllables
        const words = speech.words;
        const sylls: Syllable[] = [];
        for (const w of words){
            for (const s of w.syllables){
                sylls.push(s);
            }
        }

        // apply performance over syllables
        let index = 0;
        const tempo = performance.tempo;
        for (let i = 0; i < sylls.length; i++){
            const pitch = performance.pitches[i];
            const duration = performance.durations[i];
            const syllableDuration = tempo*duration;
            const syllableLength = sylls[i].phonemes.length;
            const phonemeDuration = syllableDuration / syllableLength;
            for (const p of sylls[i].phonemes){
                buffers[index] = adjustSamplePitch(buffers[index], pitch);
                buffers[index] = adjustSampleLength(buffers[index], phonemeDuration);
                index++;
            }
        }

        // apply fades
        for (let i = 0; i < buffers.length - 1; i++){
            let fOut: number = 0;
            let fIn: number = transitions[i].entry.fadeType === "SHORT" ? 4410 : 17500;
            
            if (!transitions[i]) continue;
            switch(transitions[i].exit.fadeType){
                case "SHORT":
                    fOut = 4410;
                    break;
                case "LONG":
                    fOut = 17500;
                    break;
                case "MAX":
                    fOut = getFadeFromMax(buffers[i])
                    break;
            }
            fadeOut(buffers[i], fOut);
            fadeIn(buffers[i+1], fIn);
        }

        // add audio sources together
        const speechAudio = this.applyTransitions(buffers, transitions);

        playSound(speechAudio);

    }

    applyTransitions(buffers: AudioBuffer[], transitions: TransitionProtocol[]): AudioBuffer{
        
        // sum length of all buffers, subtract overlap to get new length
        let bufferLength = 0;
        for (const ab of buffers) bufferLength += ab.length;
        for (const t of transitions) bufferLength -= t.overlap.amount;

        //write audio data
        const newBuffer = createAudioBuffer(buffers[0].numberOfChannels, bufferLength, buffers[0].sampleRate);
        const data = newBuffer.getChannelData(0);
        let index = 0;
        for (let i = 0; i < buffers.length; i++){
            const bufferData = buffers[i].getChannelData(0);

            // sum data for cross fade
            for (let j = 0; j < buffers[i].length; j++){
                data[index+j] += bufferData[j];
            }

            //travel to overlap index
            if (!transitions[i]) continue;
            if (transitions[i].exit.fadeType === "MAX") continue;
            index += buffers[i].length - transitions[i].overlap.amount;
        }

        return newBuffer;
    }

}