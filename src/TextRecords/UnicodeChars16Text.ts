/// <reference path="../!ref.ts" />

class UnicodeChars16Text extends _UnicodeCharsNNText {
    public static _RecordType: number = 0xB8;
    public static _RecordTypeString: string = "UnicodeChars16Text";

    private static _LengthHeaderBytes: number = 2;

    constructor(str?: string) {
        super(UnicodeChars16Text._RecordType,
            UnicodeChars16Text._RecordTypeString,
            UnicodeChars16Text._LengthHeaderBytes);

        this.uint8MaxLength(0xFFFF);

        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
}