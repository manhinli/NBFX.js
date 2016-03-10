/// <reference path="../!ref.ts" />

class Int16Text extends _FixedLengthText {
    public static _RecordType: number = 0x8A;
    public static _RecordTypeString: string = "Int16Text";

    private static _Length: number = 2;

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return this.uint8DataView().getInt16(0, true);
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return this.toNative().toString(10);
    }

    constructor(num?: number) {
        super(Int16Text._RecordType,
            Int16Text._RecordTypeString,
            Int16Text._Length);

        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int16Text._Length));
            this.uint8DataView().setInt16(0, num, true);
        }
    }
}