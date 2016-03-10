/// <reference path="../!ref.ts" />

class Chars16Text extends _CharsNNText {
    public static _RecordType: number = 0x9A;
    public static _RecordTypeString: string = "Chars16Text";

    private static _LengthHeaderBytes: number = 2;

    constructor(str?: string) {
        super(Chars16Text._RecordType,
            Chars16Text._RecordTypeString,
            Chars16Text._LengthHeaderBytes);

        this.uint8MaxLength(0xFFFF);

        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
}