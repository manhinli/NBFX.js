/// <reference path="../!ref.ts" />

abstract class _BaseRecordType implements $INBFX {
    
    private _maxUint8Length: number;
    private _uint8: Uint8Array;   // Raw data stored here

    // Abstract
    
    protected abstract processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    
    protected abstract generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    
    
    public toNBFXString(escapeXML: boolean = false): string {
        return this.generateNBFXStringRepresentation(undefined, escapeXML);
    }

    public toString(radix?: number): string {
        return this.generateNBFXStringRepresentation(radix);
    }
    
    // Abstract
    
    public abstract toNBFXArray(): Uint8Array;

    public abstract toNative(): any;
    
    
    
    
    protected uint8MaxLength(length: number): this {
        this._maxUint8Length = length;
        return this;
    }

    protected uint8Length(): number {
        return this._uint8.byteLength;
    }
    
    protected uint8(arr?: Uint8Array): Uint8Array {
        if (arr) {
            if (this._maxUint8Length >= 0 && arr.byteLength > this._maxUint8Length) {
                throw new Error("Array too long");
            } 
            
            this._uint8 = arr;
            return this._uint8;
        }
        
        return this._uint8;
    }
    
    protected uint8DataView(): DataView {
        return $Uint8ArrayUtil.DataView(this.uint8());
    }
    
    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (this.uint8()) {
            return null;
        }
        
        return this.processNBFXArray(arr);
    }
}