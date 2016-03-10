/// <reference path="../!ref.ts" />

class ShortXmlnsAttribute extends _AttributeRecord<_String> {
    public static _RecordType: number = 0x08;
    public static _RecordTypeString: string = "ShortXmlnsAttribute";

    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var value: _String = new _String();
        var valueConsumeResult: $IConsumeNBFXArrayResult<_String> = value.consumeNBFXArray(arr);
        
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

    constructor(value?: string | _String) {
        super(ShortXmlnsAttribute._RecordType, ShortXmlnsAttribute._RecordTypeString);

        if (typeof value === "string") {
            this.saveValue(new _String(value));
        } else if (value instanceof _String) {
            this.saveValue(value);
        }
    }
}