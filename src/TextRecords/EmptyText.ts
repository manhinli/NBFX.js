/// <reference path="../!ref.ts" />

class EmptyText extends _EmptyDataText {
    public static _RecordType: number = 0xA8;
    public static _RecordTypeString: string = "EmptyText"

    public toNative(): string {
        return "";
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return "";
    }

    constructor() {
        super(EmptyText._RecordType, EmptyText._RecordTypeString);
    }
}