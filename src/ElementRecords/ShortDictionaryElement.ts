/// <reference path="../!ref.ts" />

class ShortDictionaryElement extends _ElementRecord<_DictionaryString> {
    public static _RecordType: number = 0x42;
    public static _RecordTypeString: string = "ShortDictionaryElement";

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var name: _DictionaryString = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    }

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        var out: string = "<" + this.getName().toNBFXString();
        
        this.getAttributes().forEach((a) => {
            out += a.toNBFXString(escapeXML);
        });
        
        return out + ">";
    }

    constructor(name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>) {
        super(ShortDictionaryElement._RecordType, ShortDictionaryElement._RecordTypeString);

        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}