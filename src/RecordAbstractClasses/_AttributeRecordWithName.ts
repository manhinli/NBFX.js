/// <reference path="../!ref.ts" />

abstract class _AttributeRecordWithName<NameType extends _BaseRecordType, ValueType extends _TextRecord> extends _AttributeRecord<ValueType>  {
    private _name: NameType;

    protected getName(): NameType {
        return this._name;
    }

    protected saveName(name: NameType): this {
        if (name.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for attributes");
        }
        
        if (typeof name === "undefined") {
            throw new Error("Invalid name");
        }
        
        if (name.toString().length === 0) {
            throw new Error("Length of name must be nonzero");
        }

        this._name = name;
        return this;
    }

    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (!(this.getName() === undefined) || !(this.getValue() === undefined)) { return null; }

        var nameConsumeResult: $IConsumeNBFXArrayResult<NameType> = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;
        var valueConsumeResult: $IConsumeNBFXArrayResult<ValueType> = this.processValueFromNBFXArray(arr);

        this.saveName(nameConsumeResult.object);
        this.saveValue(valueConsumeResult.object);

        return {
            consumedBytes: nameConsumeResult.consumedBytes + valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        }
    }

    protected abstract processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<NameType>;

    public toNBFXArray(): Uint8Array {
        var nameBytes: Uint8Array = this.getName().toNBFXArray();
        var valueBytes: Uint8Array = this.getValue().toNBFXArray();

        var out: Uint8Array = new Uint8Array(nameBytes.byteLength + valueBytes.byteLength);

        out.set(nameBytes, 0);
        out.set(valueBytes, nameBytes.byteLength);

        return out;
    }

    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);
    }
}