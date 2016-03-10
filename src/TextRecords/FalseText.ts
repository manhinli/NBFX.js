/// <reference path="../!ref.ts" />

class FalseText extends _EmptyDataText {
    public static _RecordType: number = 0x84;
    public static _RecordTypeString: string = "FalseText"

    public toNative(): boolean {
        return false;
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return "false";
    }

    constructor() {
        super(FalseText._RecordType, FalseText._RecordTypeString);
    }
}