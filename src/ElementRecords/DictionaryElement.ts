/// <reference path="../!ref.ts" />

class DictionaryElement extends _ElementRecordWithPrefix<_DictionaryString> {
    public static _RecordType: number = 0x43;
    public static _RecordTypeString: string = "Element";

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var name: _DictionaryString = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    }

    constructor(name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>) {
        super(DictionaryElement._RecordType, DictionaryElement._RecordTypeString);

        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}