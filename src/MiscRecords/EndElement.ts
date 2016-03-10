/// <reference path="../!ref.ts" />

class EndElement extends _NBFXRecord {
    public static _RecordType: number = 0x01;
    public static _RecordTypeString: string = "EndElement";

    private _attachedElementRecord: _ElementRecord<any>;

    public attachToElementRecord(elementRecord: any): this {
        this._attachedElementRecord = elementRecord;
        return this;
    }

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

    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        return this.processNBFXArray(arr);
    }
    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return "</" + this._attachedElementRecord.getTagName() + ">";
    }

    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    constructor() {
        super(EndElement._RecordType, EndElement._RecordTypeString);
    }
}