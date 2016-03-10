/// <reference path="../!ref.ts" />

abstract class _FixedLengthText extends _TextRecord {
    private _length: number;
    
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        var consumedBytesArray: Uint8Array = $Uint8ArrayUtil.Extract(arr, this._length);
        var remainingBytesArray: Uint8Array = $Uint8ArrayUtil.Advance(arr, this._length);

        this.uint8(consumedBytesArray);

        return {
            consumedBytes: consumedBytesArray.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        }
    }
        
    public toNBFXArray(): Uint8Array {
        if (this.uint8Length() != this._length) {
            throw new Error("Mismatched byte length");
        }
        
        return this.uint8();
    }
    
    constructor(recordType: number, recordTypeString: string, length: number) {
        super(recordType, recordTypeString);
        
        this._length = length;
        this.uint8MaxLength(this._length);
    }
}