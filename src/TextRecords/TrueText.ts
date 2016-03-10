/// <reference path="../!ref.ts" />

class TrueText extends _EmptyDataText {
    public static _RecordType: number = 0x86;
    public static _RecordTypeString: string = "TrueText"

    public toNative(): boolean {
        return true;
    }

    public getTextContent(escapeXML?: boolean): string {
        return "true";
    }

    constructor() {
        super(TrueText._RecordType, TrueText._RecordTypeString);
    }
}