/// <reference path="../!ref.ts" />

class PrefixElement extends _ElementRecordWithPrefix<_String> {
    public static _RecordType: number = 0x5E;
    public static _RecordTypeString: string = "PrefixElement";
    
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var name: _String = new _String();
        return name.consumeNBFXArray(arr);
    }

    constructor(prefix: string | number, name?: string | _String, attributes?: Array<_AttributeRecord<any>>) {
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
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}