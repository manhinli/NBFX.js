/// <reference path="../!ref.ts" />

abstract class _CharsNNText extends _FixedLengthHeaderText {
    protected saveUTF8(str: string): this {
        this.uint8($UnicodeUtil.StringToUTF8Array(str));
        return this;
    }

    public toNative(): any {
        return this.generateNBFXStringRepresentation();
    }

    public getTextContent(escapeXML?: boolean): string {
        var out: string = $UnicodeUtil.UTF8ArrayToString(this.uint8());

        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        
        return out;
    }

    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number) {
        super(recordType, recordTypeString, lengthHeaderBytes);
    }
}