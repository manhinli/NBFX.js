/// <reference path="../!ref.ts" />

class ZeroText extends _EmptyDataText {
    public static _RecordType: number = 0x80;
    public static _RecordTypeString: string = "ZeroText"

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return "0" +
            this.getAttachedElementRecordEndTag();
    }

    public toNative(): number {
        return 0;
    }

    public getTextContent(escapeXML?: boolean): string {
        return "0";
    }

    constructor() {
        super(ZeroText._RecordType, ZeroText._RecordTypeString);
    }
}