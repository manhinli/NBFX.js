/// <reference path="../!ref.ts" />

abstract class _FixedLengthHeaderText extends _TextRecord {
    private _lengthHeaderBytes: number;
    
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        var stringLength: number = 0;
        var dataView: DataView = $Uint8ArrayUtil.DataView(arr);
        
        // Little endian
        for (var i = this._lengthHeaderBytes - 1; i >= 0; --i) {
            stringLength <<= 8;
            stringLength |= dataView.getUint8(i);
        }
        
        arr = $Uint8ArrayUtil.Advance(arr, this._lengthHeaderBytes);
        
        var consumedBytesArray: Uint8Array = $Uint8ArrayUtil.Extract(arr, stringLength);
        var remainingBytesArray: Uint8Array = $Uint8ArrayUtil.Advance(arr, stringLength);

        this.uint8(consumedBytesArray);

        return {
            consumedBytes: this._lengthHeaderBytes + consumedBytesArray.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        }
    }
        
    public toNBFXArray(): Uint8Array {
        var out: Uint8Array = new Uint8Array(this._lengthHeaderBytes + this.uint8Length());
        var dataView: DataView = $Uint8ArrayUtil.DataView(out);
        
        // Little endian
        var valueToWrite: number = this.uint8Length();
        for (var i = 0; i < this._lengthHeaderBytes; ++i) {
            dataView.setUint8(i, valueToWrite & 0xFF);
            valueToWrite >>>= 8;
        }
        
        out.set(this.uint8(), this._lengthHeaderBytes);

        return out;
    }
    
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number) {
        super(recordType, recordTypeString);
        
        this._lengthHeaderBytes = lengthHeaderBytes;
    }
}