/// <reference path="../!ref.ts" />

class UnicodeChars32Text extends _TextRecord {
    public static _RecordType: number = 0xBA;
    public static _RecordTypeString: string = "UnicodeChars32Text";

    protected saveUTF16(str: string): this {
        this.uint8($UnicodeUtil.StringToUTF16Array(str, true));
        return this;
    }

    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        // Length header block is MBI31
        var lengthHeader: _MultiByteInt31 = new _MultiByteInt31();
        var mbi31ConsumeResult: $IConsumeNBFXArrayResult<_MultiByteInt31> = lengthHeader.consumeNBFXArray(arr);
        var contentLength = lengthHeader.toNative();
        
        // Advance
        arr = mbi31ConsumeResult.remainingArray;
        
        var consumedArrayBytes: Uint8Array = $Uint8ArrayUtil.Extract(arr, contentLength);
        var remainingBytesArray: Uint8Array = $Uint8ArrayUtil.Advance(arr, contentLength);
        
        this.uint8(consumedArrayBytes);
        
        return {
            consumedBytes: mbi31ConsumeResult.consumedBytes + consumedArrayBytes.byteLength, // The whole thing
            remainingArray: remainingBytesArray,
            object: this
        }
    }
    
    public toNBFXArray(): Uint8Array {
        var lengthBytesArray: Uint8Array = new _MultiByteInt31(this.uint8Length()).toNBFXArray();
        
        var out: Uint8Array = new Uint8Array(lengthBytesArray.byteLength + this.uint8Length());
        
        out.set(lengthBytesArray, 0);
        out.set(this.uint8(), lengthBytesArray.byteLength);
        
        return out;
    }

    public toNative(): any {
        return this.generateNBFXStringRepresentation();
    }
    
    public getTextContent(escapeXML?: boolean): string {
        var out: string = $UnicodeUtil.UTF16ArrayToString(this.uint8(), true);

        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        
        return out;
    }

    constructor(str?: string) {
        super(UnicodeChars32Text._RecordType,
            UnicodeChars32Text._RecordTypeString);

        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
}