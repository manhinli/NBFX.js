/// <reference path="../!ref.ts" />

class OneText extends _EmptyDataText {
    public static _RecordType: number = 0x82;
    public static _RecordTypeString: string = "OneText"

    public toNative(): number {
        return 1;
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return "1";
    }

    constructor() {
        super(OneText._RecordType, OneText._RecordTypeString);
    }
}