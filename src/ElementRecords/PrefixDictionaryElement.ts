/// <reference path="../!ref.ts" />

class PrefixDictionaryElement extends _ElementRecordWithPrefix<_DictionaryString> {
    public static _RecordType: number = 0x44;
    public static _RecordTypeString: string = "PrefixDictionaryElement";
    
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var name: _DictionaryString = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    }

    constructor(prefix: string | number, name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>) {
        if (typeof prefix === "number") {
            this.savePrefix(new _String($PrefixSingleCharUtil.ValueToChar(prefix)));
        } else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }

            this.savePrefix(new _String(prefix.toLowerCase()));
        }

        var recordType: number = PrefixElement._RecordType + $PrefixSingleCharUtil.CharToValue(this.getPrefix().toString());
        var recordTypeString: string = PrefixElement._RecordTypeString + this.getPrefix().toString().toUpperCase();

        super(recordType, recordTypeString, false);

        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}