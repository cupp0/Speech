import { dictionary } from "cmu-pronouncing-dictionary";

const audioContext = new AudioContext()
const auxiliary: string[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "-",
    "!",
    "+",
    "/",
    "#",
    ":",
    ".",
    "?"
]

// list of strings, where each string is a word translated to arpabet,
// and each sound is separated by a space
function textToArpabet(words: String): String[]{
    const wordList = words.split(" ")
    const arpList: string[] = []

    for (const word of wordList){

        //get arp pronunciation
        let arpWord = dictionary[word]

        //misspellings get skipped
        if (!arpWord) continue;

        //get rid of auxiliary characters
        for (const char of auxiliary) arpWord = arpWord.replace(char, "");
        
        arpList.push(arpWord)
    }

    return arpList;
}

const wordInput =
    document.getElementById("wordInput") as HTMLInputElement;

const lookupButton =
    document.getElementById("lookupButton") as HTMLButtonElement;

const result =
    document.getElementById("result") as HTMLParagraphElement;


lookupButton.addEventListener("click", async () => {

    // translate text
    const phonemeList = textToArpabet(wordInput.value);

    // generate sequence of audio buffers
    const wavList: AudioBuffer[] = []; 
    for (const word of phonemeList){
        const sounds: String[] = word.split(" ");
        for (const sound of sounds){

            // get wav file
            const wavFile = await fetch("src/phonemes/"+sound+".wav");

            // get audio buffer
            const arrayBuffer = await wavFile.arrayBuffer();
            const decoded = await audioContext.decodeAudioData(arrayBuffer);
            
            //append it to our buffer list
            wavList.push(decoded);
        }      
    }

    //concatenate those buffers to a single buffer
    let wavLength = 0;
    for (const buffer of wavList) wavLength += buffer.length;

    const outputBuffer = audioContext.createBuffer(
        1,          // channel count
        wavLength,  // total samples
        44100       // sample rate
    )

    let index = 0;
    const outSamples = outputBuffer.getChannelData(0);

    for (const buffer of wavList){
        const readSamples = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++){
            outSamples[index] = readSamples[i];
            index++;
        }
    }

    // create a source node for our concatenated buffer and play it
    const source = audioContext.createBufferSource();
    source.buffer = outputBuffer;
    source.connect(audioContext.destination);
    source.start();
    
});
