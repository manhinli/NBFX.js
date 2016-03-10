/// <reference path="../!ref.ts" />

class UniqueIdText extends _UuidText {
    public static _RecordType: number = 0xAC;
    public static _RecordTypeString: string = "UniqueIdText";

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return super.generateNBFXStringRepresentation();
    }

    public getTextContent(escapeXML?: boolean): string {
        return "urn:uuid:" + super.getTextContent(escapeXML);
    }

    constructor(arr?: Uint8Array) {
        super(UniqueIdText._RecordType,
            UniqueIdText._RecordTypeString);

        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
}