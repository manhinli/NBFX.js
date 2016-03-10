/// <reference path="../!ref.ts" />

class _MultiByteInt31 extends _BaseRecordType {
    private _value: number;

    private static ArrayToValue(arr: Uint8Array): number {
        var numberOfBytes = _MultiByteInt31.DetectNumberOfBytes(arr);
        
        var value: number = 0;

        for (var i = numberOfBytes - 1; i >= 0; --i) {
            var block: number = arr[i];
            
            // Strip leading bit
            block &= 0x7F;
            
            // Append
            value |= block;
            
            // Shift
            if (i != 0) {
                value <<= 7;
            }
        }

        return value;
    }
    
    private static DetectNumberOfBytes(arr: Uint8Array): number {
        var numOfBytes: number = 0;

        if (arr.length > 5) {
            throw new Error("Array too long for MultiByteInt31");
        }
        
        for (var i = 0; i < arr.length; ++i) {
            ++numOfBytes;
            
            if (!(arr[i] & 0x80)) {
                break;
            }
        }

        return numOfBytes;
    }
    
    private numberOfBytes(): number {
        var v: number = this._value;
        var bytes: number = 1;

        if (v <= 0x7F) { return bytes; }; ++bytes;
        if (v <= 0x3FFF) { return bytes; }; ++bytes;
        if (v <= 0x1FFFFF) { return bytes; }; ++bytes;
        if (v <= 0x0FFFFFFF) { return bytes; }; ++bytes;
        if (v <= 0x007FFFFFFF) { return bytes; };

        return null;
    }
    
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        var searchBytesLength: number = Math.min(arr.byteLength, 5);
        
        var validBytesLength: number = _MultiByteInt31.DetectNumberOfBytes($Uint8ArrayUtil.Extract(arr, searchBytesLength));
        
        var consumedArrayBytes: Uint8Array = $Uint8ArrayUtil.Extract(arr, validBytesLength);
        var remainingBytesArray: Uint8Array = $Uint8ArrayUtil.Advance(arr, validBytesLength);
        
        this._value = _MultiByteInt31.ArrayToValue(consumedArrayBytes);
        
        return {
            consumedBytes: consumedArrayBytes.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        }
    }
    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return this._value.toString(radix);
    }
    
    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (!(this._value === undefined)) {
            return null;
        }
        
        return this.processNBFXArray(arr);
    }
    
    public toNBFXArray(): Uint8Array {
        var byteLength: number = this.numberOfBytes();
        var outArray: Uint8Array = new Uint8Array(byteLength);

        var v: number = this._value;
        
        // Little-endian
        for (var i = 0; i < byteLength; ++i) {
            // Insert 7 bit segment with first bit set
            var block: number = (v & 0x7F) | 0x80;
            
            // Only preserve MSB 3 bits on highest block of 5
            // (Shouldn't be necessary, but just in case.)
            if (i >= 4) {
                block &= 0x07;
            }

            outArray[i] = block;
            
            // Shift
            v >>>= 7;
        }
        
        // Unset first bit on MSB block
        outArray[byteLength - 1] &= 0x7F;
        
        return outArray;
    }

    public toNative(): number {
        return this._value;
    }

    constructor(value?: number) {
        super();
        
        if (typeof value === "number") {
            this._value = value;
        }
    }
}