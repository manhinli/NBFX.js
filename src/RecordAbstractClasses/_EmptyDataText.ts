/// <reference path="../!ref.ts" />

abstract class _EmptyDataText extends _TextRecord {
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        return {
            consumedBytes: 0,
            remainingArray: arr,
            object: this
        }
    }
        
    public toNBFXArray(): Uint8Array {
        return new Uint8Array(0);
    }
    
    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);
    }
}