/// <reference path="../!ref.ts" />

class DictionaryXmlnsAttribute extends _AttributeRecordXmlnsWithPrefix<_DictionaryString> {
    public static _RecordType: number = 0x0B;
    public static _RecordTypeString: string = "DictionaryXmlnsAttribute";

    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var value: _DictionaryString = new _DictionaryString();
        return value.consumeNBFXArray(arr);
    }

    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\""
    }
    
    public getAttributeName(): string {
        return "xmlns:" + this.getPrefix().toNBFXString();
    }
    
    public getAttributeValue(escapeXML?: boolean): string {
        return this.getValue().toNBFXString(escapeXML);
    }
    
    constructor(prefix?: string | _String, value?: _DictionaryString) {
        super(DictionaryXmlnsAttribute._RecordType, DictionaryXmlnsAttribute._RecordTypeString);

        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix))
            this.saveValue(value);
        } else if (prefix instanceof _String) {
            this.savePrefix(prefix)
            this.saveValue(value);
        }
    }
}