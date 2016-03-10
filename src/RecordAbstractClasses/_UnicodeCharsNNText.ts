/// <reference path="../!ref.ts" />

abstract class _UnicodeCharsNNText extends _FixedLengthHeaderText {
    protected saveUTF16(str: string): this {
        this.uint8($UnicodeUtil.StringToUTF16Array(str, true));
        return this;
    }

    public toNative(): any {
        return this.generateNBFXStringRepresentation();
    }

    public getTextContent(escapeXML?: boolean) {
        var out: string = $UnicodeUtil.UTF16ArrayToString(this.uint8(), true);
        
        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        
        return out;
    }

    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number) {
        super(recordType, recordTypeString, lengthHeaderBytes);
    }
}