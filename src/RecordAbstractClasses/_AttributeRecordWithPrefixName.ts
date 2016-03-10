/// <reference path="../!ref.ts" />

abstract class _AttributeRecordWithPrefixName<NameType extends _BaseRecordType, ValueType extends _TextRecord> extends _AttributeRecordWithName<NameType, ValueType>  {
    private _prefix: _String;

    protected getPrefix(): _String {
        return this._prefix;
    }

    protected savePrefix(prefix: _String): this {
        if (prefix.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for prefixes");
        }
        
        if (typeof prefix === "undefined") {
            throw new Error("Invalid prefix");
        }
        
        if (prefix.toString().length === 0) {
            throw new Error("Length of prefix must be nonzero");
        }

        this._prefix = prefix;
        return this;
    }

    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (!(this.getPrefix() === undefined) || !(this.getName() === undefined) || !(this.getValue() === undefined)) { return null; }

        var prefix: _String = new _String();
        var prefixConsumeResult: $IConsumeNBFXArrayResult<_String> = prefix.consumeNBFXArray(arr);
        arr = prefixConsumeResult.remainingArray;

        var nameConsumeResult: $IConsumeNBFXArrayResult<NameType> = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;

        var valueConsumeResult: $IConsumeNBFXArrayResult<ValueType> = this.processValueFromNBFXArray(arr);

        this.savePrefix(prefixConsumeResult.object);
        this.saveName(nameConsumeResult.object);
        this.saveValue(valueConsumeResult.object);

        return {
            consumedBytes: prefixConsumeResult.consumedBytes + nameConsumeResult.consumedBytes + valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        }
    }

    public toNBFXArray(): Uint8Array {
        var prefixBytes: Uint8Array = this.getPrefix().toNBFXArray();
        var nameBytes: Uint8Array = this.getName().toNBFXArray();
        var valueBytes: Uint8Array = this.getValue().toNBFXArray();

        var out: Uint8Array = new Uint8Array(prefixBytes.byteLength + nameBytes.byteLength + valueBytes.byteLength);

        out.set(prefixBytes, 0);
        out.set(nameBytes, prefixBytes.byteLength);
        out.set(valueBytes, prefixBytes.byteLength + nameBytes.byteLength);

        return out;
    }

    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);
    }
}