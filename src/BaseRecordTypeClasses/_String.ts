/// <reference path="../!ref.ts" />

class _String extends _BaseRecordType {
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        // Length header block is MBI31
        var lengthHeader: _MultiByteInt31 = new _MultiByteInt31();
        var mbi31ConsumeResult: $IConsumeNBFXArrayResult<_MultiByteInt31> = lengthHeader.consumeNBFXArray(arr);
        var stringLength = lengthHeader.toNative();
        
        // Advance
        arr = mbi31ConsumeResult.remainingArray;
        
        var consumedArrayBytes: Uint8Array = $Uint8ArrayUtil.Extract(arr, stringLength);
        var remainingBytesArray: Uint8Array = $Uint8ArrayUtil.Advance(arr, stringLength);
        
        this.uint8(consumedArrayBytes);
        
        return {
            consumedBytes: mbi31ConsumeResult.consumedBytes + consumedArrayBytes.byteLength, // The whole thing
            remainingArray: remainingBytesArray,
            object: this
        }
    }
    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return $UnicodeUtil.UTF8ArrayToString(this.uint8());
    }
    
    public toNBFXArray(): Uint8Array {
        var lengthHeader: _MultiByteInt31 = new _MultiByteInt31(this.uint8Length());
        var lengthHeaderNBFXArray: Uint8Array = lengthHeader.toNBFXArray();
        
        var out: Uint8Array = new Uint8Array(lengthHeaderNBFXArray.byteLength + this.uint8Length());
        
        out.set(lengthHeaderNBFXArray, 0);
        out.set(this.uint8(), lengthHeaderNBFXArray.byteLength);
        
        return out;
    }
    
    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    constructor(value?: string) {
        super();

        if (typeof value === "string") {
            this.uint8($UnicodeUtil.StringToUTF8Array(value));
        }
    }
}