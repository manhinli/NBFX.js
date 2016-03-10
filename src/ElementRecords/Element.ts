/// <reference path="../!ref.ts" />

class ElementRecord extends _ElementRecordWithPrefix<_String> {
    public static _RecordType: number = 0x41;
    public static _RecordTypeString: string = "Element";

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var name: _String = new _String();
        return name.consumeNBFXArray(arr);
    }

    constructor(name?: string | _String, attributes?: Array<_AttributeRecord<any>>) {
        super(ElementRecord._RecordType, ElementRecord._RecordTypeString);

        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}