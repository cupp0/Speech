import { dictionary } from "cmu-pronouncing-dictionary";
import { phonemeTypes } from "../src/PhonemeTypes"
import Syllable from "../src/Syllable"
import Phoneme from "../src/Phoneme"

export default class Word {

    text: string;         // user input
    phonemes: Phoneme[]   // phonetic spelling
    syllables: Syllable[] // useful for timing/performance stuff

    constructor(text: string) {
        this.text = text;
        this.phonemes = this.getPhonemes(this.text);
        this.syllables = this.extractSyllables();
    }

    // look up word in phonetic dictionary, split into list of arpabet labels
    // construct list of Phonemes from those labels
    getPhonemes(text: string): Phoneme[] {
        const phonemeList: Phoneme[] = [];
        const ARPAtext: string[] = this.toARPABET(text).split(" ");
        for (const p of ARPAtext)phonemeList.push(new Phoneme(p))
        return phonemeList;
    }

    // list of strings, where each string is a word translated to arpabet,
    // and each sound is separated by a space
    toARPABET(word: string): string{
        let arpWord = dictionary[word]
        if (!arpWord) return "W UW P S";
        // get rid of auxiliary characters for now
        for (const char of phonemeTypes.get("auxiliary")!){
            while (arpWord.includes(char)) arpWord = arpWord.replace(char, "");
        }   
        return arpWord;
    }

    // roughly groups syllables based on vowel positions
    extractSyllables(): Syllable[]{
        
        const syllables: Syllable[] = []

        // find each vowel position
        const vowelPositions: number[] = [];
        for (let i = 0; i < this.phonemes.length; i++){
            if (phonemeTypes.get("VOWEL")!.includes(this.phonemes[i].label)) vowelPositions.push(i);
        }

        // everything up until the next vowel is grouped
        let index = 0;
        for (let i = 0; i < vowelPositions.length; i++){
            const syllablePhonemes: Phoneme[] = [];
            const targetPos = i === vowelPositions.length - 1 ? 
                this.phonemes.length :
                vowelPositions[i+1]
            
            for (let j = index; j < targetPos; j++){
                syllablePhonemes.push(this.phonemes[j])
            }

            syllables.push(new Syllable(syllablePhonemes));
            index = targetPos;
        }

        return syllables;
    }
}