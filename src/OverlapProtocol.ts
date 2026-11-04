export default class OverlapProtocol{
    type: string;     // START, END
    amount: number;   // 0, 17500, 4410, or position of max sample to end

    constructor(f: string, fadeType: string){
        this.type = f;
        this.amount = this.determineOverlapAmount(fadeType);
    }

    determineOverlapAmount(fadeType: string): number{
        if (this.type === "END") return 0;
        return this.type === "LONG" ? 17500: 4410
    }
}