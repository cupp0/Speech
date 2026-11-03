import Word from "../src/Word"

export default class Speech {

    text: string;  // user input
    words: Word[];

    constructor(text: string) {
        this.text = text;
        this.words = this.extractWords(this.text);
        
    }

    extractWords(theText: string): Word[] {
        const wordList: Word[] = [];
        const splitText = theText.split(" ");
        for (const w of splitText){
            wordList.push(new Word(w))
        }
        return wordList;
    }

}