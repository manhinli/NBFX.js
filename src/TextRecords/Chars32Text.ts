/// <reference path="../!ref.ts" />

class Chars32Text extends _CharsNNText {
    public static _RecordType: number = 0x9C;
    public static _RecordTypeString: string = "Chars32Text";

    private static _LengthHeaderBytes: number = 4;

    constructor(str?: string) {
        super(Chars32Text._RecordType,
            Chars32Text._RecordTypeString,
            Chars32Text._LengthHeaderBytes);

        this.uint8MaxLength(0x7FFFFFFF);

        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
}