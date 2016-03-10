/// <reference path="../!ref.ts" />

abstract class _BytesNNText extends _FixedLengthHeaderText {
    protected saveBase64(b64: string): this {
        this.uint8($Base64Util.Base64toUint8Array(b64));      
        return this;
    }

    public toNative(): any {
        return this.uint8();
    }

    public getTextContent(escapeXML?: boolean) {
        return $Base64Util.Uint8ArrayToBase64(this.uint8());
    }
    
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number) {
        super(recordType, recordTypeString, lengthHeaderBytes);
    }
}