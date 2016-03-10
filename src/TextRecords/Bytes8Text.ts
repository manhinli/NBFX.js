/// <reference path="../!ref.ts" />

class Bytes8Text extends _BytesNNText {
    public static _RecordType: number = 0x9E;
    public static _RecordTypeString: string = "Bytes8Text";

    private static _LengthHeaderBytes: number = 1;

    constructor(b64?: string) {
        super(Bytes8Text._RecordType,
            Bytes8Text._RecordTypeString,
            Bytes8Text._LengthHeaderBytes);

        this.uint8MaxLength(0xFF);

        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
}