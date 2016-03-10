/// <reference path="../!ref.ts" />

class Bytes32Text extends _BytesNNText {
    public static _RecordType: number = 0xA2;
    public static _RecordTypeString: string = "Bytes32Text";

    private static _LengthHeaderBytes: number = 4;

    constructor(b64?: string) {
        super(Bytes32Text._RecordType,
            Bytes32Text._RecordTypeString,
            Bytes32Text._LengthHeaderBytes);
            
        this.uint8MaxLength(0x7FFFFFFF);

        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
}