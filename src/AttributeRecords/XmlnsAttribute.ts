/// <reference path="../!ref.ts" />

class XmlnsAttribute extends _AttributeRecordXmlnsWithPrefix<_String> {
    public static _RecordType: number = 0x09;
    public static _RecordTypeString: string = "XmlnsAttribute";

    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var value: _String = new _String();
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

    constructor(prefix?: string | _String, value?: _String) {
        super(XmlnsAttribute._RecordType, XmlnsAttribute._RecordTypeString);

        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix))
            this.saveValue(value);
        } else if (prefix instanceof _String) {
            this.savePrefix(prefix)
            this.saveValue(value);
        }
    }
}