/// <reference path="../!ref.ts" />

class DoubleText extends _FixedLengthText {
    public static _RecordType: number = 0x92;
    public static _RecordTypeString: string = "DoubleText";

    private static _Length: number = 8;

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return $NumberUtil.ToNBFXString(this.toNative(), radix) +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return this.uint8DataView().getFloat64(0, true);
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return $NumberUtil.ToNBFXString(this.toNative(), 10);
    }

    constructor(num?: number) {
        super(DoubleText._RecordType,
            DoubleText._RecordTypeString,
            DoubleText._Length);

        if (typeof num === "number") {
            this.uint8(new Uint8Array(DoubleText._Length));
            this.uint8DataView().setFloat64(0, num, true);
        }
    }
}