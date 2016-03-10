/// <reference path="../!ref.ts" />

class FloatText extends _FixedLengthText {
    public static _RecordType: number = 0x90;
    public static _RecordTypeString: string = "FloatText";

    private static _Length: number = 4;

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return $NumberUtil.ToNBFXString(this.toNative(), radix) +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return this.uint8DataView().getFloat32(0, true);
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return $NumberUtil.ToNBFXString(this.toNative(), 10);
    }

    constructor(num?: number) {
        super(FloatText._RecordType,
            FloatText._RecordTypeString,
            FloatText._Length);

        if (typeof num === "number") {
            this.uint8(new Uint8Array(FloatText._Length));
            this.uint8DataView().setFloat32(0, num, true);
        }
    }
}