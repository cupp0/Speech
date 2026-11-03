const audioContext = new AudioContext()

export async function createSound(phoneme: Phoneme, performance: SpeechPerformance): Promise<AudioBuffer> {
   
    const address = "public/phonemes/" + phoneme.label + ".wav"
    const soundURL = `${import.meta.env.BASE_URL}${address}`;
    const wavFile = await fetch(soundURL);
    const arrayBuffer = await wavFile.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);

}

export function playSound(buffer: AudioBuffer){
    console.log(buffer)
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
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
        //if (targetIndex > newBuffer.length - 1) continue;

        const floor = pcmData[Math.floor(targetIndex)]
        const ceil = pcmData[Math.ceil(targetIndex)]
        newData[index] = lerp(floor, ceil, targetIndex-Math.floor(targetIndex))
        //console.log(index, targetIndex, floor, ceil, newData[index])
    }

    console.log(buffer, newBuffer)

    return newBuffer
}

const lerp = (start: number, end: number, amt: number): number => start * (1 - amt) + end * amt;