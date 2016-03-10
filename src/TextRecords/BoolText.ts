/// <reference path="../!ref.ts" />

class BoolText extends _FixedLengthText {
    public static _RecordType: number = 0xB4;
    public static _RecordTypeString: string = "BoolText";

    private static _Length: number = 1;

    private saveBooleanAsNumber(b: boolean): this {
        this.uint8(new Uint8Array(BoolText._Length));
            
        if (b) {
            this.uint8DataView().setUint8(0, 0x01);
        } else {
            this.uint8DataView().setUint8(0, 0x00);
        }
        
        return this;
    }

    public toNative(): boolean {
        return ((this.uint8()[0]) ? true : false);
    }

    public getTextContent(escapeXML?: boolean) {
        return this.toNative().toString();
    }

    constructor(value?: boolean | number) {
        super(BoolText._RecordType,
            BoolText._RecordTypeString,
            BoolText._Length);

        if (typeof value === "boolean") {
            this.saveBooleanAsNumber(value);
        } else if (typeof value === "number") {
            this.saveBooleanAsNumber(!!(value));
        }
    }
}