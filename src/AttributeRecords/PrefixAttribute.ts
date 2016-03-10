/// <reference path="../!ref.ts" />

class PrefixAttribute extends _AttributeRecordWithName<_String, _TextRecord> {
    public static _RecordType: number = 0x26;
    public static _RecordTypeString: string = "PrefixAttribute";

    private _prefix: string;

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var name: _String = new _String();
        return name.consumeNBFXArray(arr);
    }

    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord> {
        var valueTypeConsumeResult: $IConsumeNBFXArrayResult<_TextRecord> = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);

        var value: _TextRecord = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;

        var valueConsumeResult: $IConsumeNBFXArrayResult<_TextRecord> = value.consumeNBFXArray(arr);
        
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;

        return valueConsumeResult;
    }

    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\""
    }
    
    public getAttributeName(): string {
        return this._prefix + ":" + this.getName().toNBFXString();
    }
    
    public getAttributeValue(escapeXML?: boolean): string {
        return this.getValue().toNBFXString(escapeXML);
    }

    constructor(prefix: string | number, name?: string | _String, value?: _TextRecord) {
        if (typeof prefix === "number") {
            this._prefix = $PrefixSingleCharUtil.ValueToChar(prefix);
        } else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }

            this._prefix = prefix.toLowerCase();
        }

        var recordType: number = PrefixAttribute._RecordType + $PrefixSingleCharUtil.CharToValue(this._prefix);
        var recordTypeString: string = PrefixAttribute._RecordTypeString + this._prefix.toUpperCase();

        super(recordType, recordTypeString);

        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveValue(value);
        } else if (name instanceof _String) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
}