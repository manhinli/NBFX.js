/// <reference path="../!ref.ts" />

class ShortDictionaryXmlnsAttribute extends _AttributeRecord<_DictionaryString> {
    public static _RecordType: number = 0x0A;
    public static _RecordTypeString: string = "ShortDictionaryXmlnsAttribute";

    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString> {
        var value: _DictionaryString = new _DictionaryString();
        var valueConsumeResult: $IConsumeNBFXArrayResult<_DictionaryString> = value.consumeNBFXArray(arr);
        
        return valueConsumeResult;
    }

    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\""
    }
    
    public getAttributeName(): string {
        return "xmlns";
    }
    
    public getAttributeValue(escapeXML?: boolean): string {
        return this.getValue().toNBFXString(escapeXML);
    }

    constructor(value?: string | _DictionaryString) {
        super(ShortDictionaryXmlnsAttribute._RecordType, ShortDictionaryXmlnsAttribute._RecordTypeString);

        if (typeof value === "string") {
            this.saveValue(new _DictionaryString(value));
        } else if (value instanceof _DictionaryString) {
            this.saveValue(value);
        }
    }
}