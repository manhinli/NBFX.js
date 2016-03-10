/// <reference path="../!ref.ts" />

class DictionaryAttribute extends _AttributeRecordWithPrefixName<_DictionaryString, _TextRecord> {
    public static _RecordType: number = 0x07;
    public static _RecordTypeString: string = "DictionaryAttribute";

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var name: _DictionaryString = new _DictionaryString();
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

    private saveNameValue(name: string | _DictionaryString, value: _TextRecord) {
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveValue(value);
        } else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
    
    public getAttributeName(): string {
        return this.getPrefix().toNBFXString() + ":" + this.getName().toNBFXString();
    }
    
    public getAttributeValue(escapeXML?: boolean): string {
        return this.getValue().toNBFXString(escapeXML);
    }

    constructor(prefix?: string | _String, name?: string | _DictionaryString, value?: _TextRecord) {
        super(DictionaryAttribute._RecordType, DictionaryAttribute._RecordTypeString);

        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix))
                .saveNameValue(name, value);
        } else if (prefix instanceof _String) {
            this.savePrefix(prefix)
                .saveNameValue(name, value);
        }
    }
}