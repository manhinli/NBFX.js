/// <reference path="../!ref.ts" />

class Int32Text extends _FixedLengthText {
    public static _RecordType: number = 0x8C;
    public static _RecordTypeString: string = "Int32Text";

    private static _Length: number = 4;

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return this.uint8DataView().getInt32(0, true);
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return this.toNative().toString(10);
    }

    constructor(num?: number) {
        super(Int32Text._RecordType,
            Int32Text._RecordTypeString,
            Int32Text._Length);

        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int32Text._Length));
            this.uint8DataView().setInt32(0, num, true);
        }
    }
}