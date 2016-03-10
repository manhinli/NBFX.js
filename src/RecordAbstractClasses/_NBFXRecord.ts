/// <reference path="../!ref.ts" />

abstract class _NBFXRecord implements $INBFX {
    private _recordType: number;
    private _recordTypeString: string;
    
    
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
    
    public abstract consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    
    public abstract toNBFXArray(): Uint8Array;

    public abstract toNative(): any;
    
    public typeOf(): number {
        return this._recordType;
    }
    
    public typeString(): string {
        return this._recordTypeString;
    }


    constructor(recordType: number, recordTypeString: string) {
        this._recordType = recordType;
        this._recordTypeString = recordTypeString;
    }
}