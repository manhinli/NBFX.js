/// <reference path="../!ref.ts" />

class ShortElement extends _ElementRecord<_String> {
    public static _RecordType: number = 0x40;
    public static _RecordTypeString: string = "ShortElement";

    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String> {
        var name: _String = new _String();
        return name.consumeNBFXArray(arr);
    }

    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        var out: string = "<" + this.getName().toNBFXString();
        
        this.getAttributes().forEach((a) => {
            out += a.toNBFXString(escapeXML);
        });
        
        return out + ">";
    }

    constructor(name?: string | _String, attributes?: Array<_AttributeRecord<any>>) {
        super(ShortElement._RecordType, ShortElement._RecordTypeString);

        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        } else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
}