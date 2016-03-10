/// <reference path="../!ref.ts" />

class UnicodeChars8Text extends _UnicodeCharsNNText {
    public static _RecordType: number = 0xB6;
    public static _RecordTypeString: string = "UnicodeChars8Text";

    private static _LengthHeaderBytes: number = 1;

    constructor(str?: string) {
        super(UnicodeChars8Text._RecordType,
            UnicodeChars8Text._RecordTypeString,
            UnicodeChars8Text._LengthHeaderBytes);

        this.uint8MaxLength(0xFF);

        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
}