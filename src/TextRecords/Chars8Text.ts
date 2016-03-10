/// <reference path="../!ref.ts" />

class Chars8Text extends _CharsNNText {
    public static _RecordType: number = 0x98;
    public static _RecordTypeString: string = "Chars8Text";

    private static _LengthHeaderBytes: number = 1;

    constructor(str?: string) {
        super(Chars8Text._RecordType,
            Chars8Text._RecordTypeString,
            Chars8Text._LengthHeaderBytes);

        this.uint8MaxLength(0xFF);

        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
}