/// <reference path="../!ref.ts" />

class Bytes16Text extends _BytesNNText {
    public static _RecordType: number = 0xA0;
    public static _RecordTypeString: string = "Bytes16Text";

    private static _LengthHeaderBytes: number = 2;

    constructor(b64?: string) {
        super(Bytes16Text._RecordType,
            Bytes16Text._RecordTypeString,
            Bytes16Text._LengthHeaderBytes);
            
        this.uint8MaxLength(0xFFFF);

        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
}