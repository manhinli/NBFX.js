/// <reference path="../!ref.ts" />

class Int8Text extends _FixedLengthText {
    public static _RecordType: number = 0x88;
    public static _RecordTypeString: string = "Int8Text";

    private static _Length: number = 1;

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return this.uint8DataView().getInt8(0);
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return this.toNative().toString(10);
    }

    constructor(num?: number) {
        super(Int8Text._RecordType,
            Int8Text._RecordTypeString,
            Int8Text._Length);

        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int8Text._Length));
            this.uint8DataView().setInt8(0, num);
        }
    }
}