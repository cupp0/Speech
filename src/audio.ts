import Phoneme from "../src/Phoneme"
import SpeechPerformance from "../src/SpeechPerformance"
import { phonemeTypes } from "../src/PhonemeTypes"

const audioContext = new AudioContext()
export const phonemeAudio = new Map<string, AudioBuffer>();

export async function loadAudioFiles(
): Promise<void> {

    for (const type of phonemeTypes.keys()){
        if (type === "auxiliary") continue
        await Promise.all(
            phonemeTypes.get(type)!.map(async (label:string) => {

                const address = "phonemes/" + label + ".wav"
                const response = await fetch(address);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                phonemeAudio.set(label, audioBuffer);
            })
        );
    }
    
}

export function createAudioBuffer(channels: number, length: number, sampleRate: number): AudioBuffer {
    return audioContext.createBuffer(
        channels,
        length,
        sampleRate
    );
}

export function copyAudioBuffer(source: AudioBuffer): AudioBuffer {
    const copy = audioContext.createBuffer(
        source.numberOfChannels,
        source.length,
        source.sampleRate
    );

    for (let channel = 0; channel < source.numberOfChannels; channel++) {
        copy.copyToChannel(
            source.getChannelData(channel),
            channel
        );
    }

    return copy;
}

export function playSound(buffer: AudioBuffer){
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
}

export function getLoudestSampleIndex(buffer: AudioBuffer):number{
    const pcmData = buffer.getChannelData(0);
    let index = 0;
    for (let i = 0; i < buffer.length; i++){
        if (Math.abs(pcmData[i]) > Math.abs(pcmData[index])) index = i;
    }
    console.log(index, buffer.length)
    return index;
}

//locates loudest point in a sample and gives length to the end
export function getFadeFromMax(buffer: AudioBuffer): number{
    return buffer.length - getLoudestSampleIndex(buffer);
}

// where - "BEGINNING" means remove from the beginning of the buffer
export function trim(buffer: AudioBuffer, where: string, index: number): AudioBuffer{
    
    const length = where === "BEGINNING" ? buffer.length - index: index;
    const startIndex = where === "BEGINNING" ? index : 0;

    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels,
        length,
        buffer.sampleRate
    );

    const pcmData = buffer.getChannelData(0);
    const newData = newBuffer.getChannelData(0);

    for (let i = 0; i < length; i++){
        if (startIndex+i >= buffer.length) continue;
        newData[i] = pcmData[startIndex+i];
    }

    return newBuffer
}

export function fadeIn(buffer: AudioBuffer, duration: number){
    const pcmData = buffer.getChannelData(0);
    for (let i = 0; i < duration; i++){
        const mult = i / duration;
        pcmData[i] *= mult;
    }
}

export function fadeOut(buffer: AudioBuffer, duration: number){
    const pcmData = buffer.getChannelData(0);
    for (let i = pcmData.length - 1; i > pcmData.length - duration; i--){
        const mult = Math.abs((i - pcmData.length - 1)  / duration);
        pcmData[i] *= mult;
    }
}

export function appendBuffers(buffers: AudioBuffer[]): AudioBuffer{

  // 1. Determine common properties and total length
  const numberOfChannels = Math.max(...buffers.map(b => b.numberOfChannels));
  const sampleRate = buffers[0].sampleRate;
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);

  // 2. Create the destination buffer
  const resultBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);

  // 3. Sequentially copy channel data from each source buffer
  for (let channel = 0; channel < numberOfChannels; channel++) {
    let offset = 0;
    
    for (const buffer of buffers) {
      // Ensure the source buffer actually has this channel (handles mono-to-stereo mismatch safely)
      if (channel < buffer.numberOfChannels) {
        const channelData = buffer.getChannelData(channel);
        resultBuffer.copyToChannel(channelData, channel, offset);
      }
      offset += buffer.length;
    }
  }

  return resultBuffer;
}

//will increase / decrease sample duration
export function adjustSamplePitch(buffer: AudioBuffer, semitones: number): AudioBuffer{

    const mult = Math.pow(1.05946309436, semitones); 
    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels, 
        Math.floor(buffer.length / mult), 
        buffer.sampleRate
    );
    const pcmData = buffer.getChannelData(0);
    const newData = newBuffer.getChannelData(0);

    for (let index = 0; index < newBuffer.length; index++){
        const targetIndex = index*mult;
        const floor = pcmData[Math.floor(targetIndex)]
        const ceil = pcmData[Math.ceil(targetIndex)]
        newData[index] = lerp(floor, ceil, targetIndex-Math.floor(targetIndex))
    }

    return newBuffer
}

//play sample forward and backwards until desired length is reached
export function adjustSampleLength(buffer: AudioBuffer, seconds: number): AudioBuffer{
    const newLength = buffer.sampleRate*seconds;
    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels, 
        newLength, 
        buffer.sampleRate
    );
    const pcmData = buffer.getChannelData(0);
    const newData = newBuffer.getChannelData(0);

    for (let index = 0; index < newLength; index++){
        const targetIndex = pingPong(index, buffer.length)
        newData[index] = pcmData[targetIndex]
    }

    return newBuffer
}

// returns a number 0 - wall, 
// if ball > wall, reflect ball over wall.
// if ball < 0, reflect ball over 0
function pingPong(ball: number, wall: number): number{
    let newIndex = ball;
    while (newIndex < 0 || newIndex >= wall){
        if (newIndex < 0) newIndex = Math.abs(newIndex);
        if (newIndex >= wall) newIndex = 2*wall - newIndex - 1;
    }
    return newIndex;
}

const lerp = (start: number, end: number, amt: number): number => start * (1 - amt) + end * amt;