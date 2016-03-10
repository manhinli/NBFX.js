/// <reference path="../!ref.ts" />

class UuidText extends _UuidText {
    public static _RecordType: number = 0xB0;
    public static _RecordTypeString: string = "UuidText";

    constructor(arr?: Uint8Array) {
        super(UuidText._RecordType,
            UuidText._RecordTypeString);

        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
}