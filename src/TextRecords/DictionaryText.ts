/// <reference path="../!ref.ts" />

class DictionaryText extends _TextRecord {
    public static _RecordType: number = 0xAA;
    public static _RecordTypeString: string = "DictionaryText";

    private _dictString: _DictionaryString;
    
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        var dictString: _DictionaryString = new _DictionaryString();
        var dictStringConsumeResult: $IConsumeNBFXArrayResult<_DictionaryString> = dictString.consumeNBFXArray(arr);
        
        this._dictString = dictStringConsumeResult.object;
        
        return {
            consumedBytes: dictStringConsumeResult.consumedBytes,
            remainingArray: dictStringConsumeResult.remainingArray,
            object: this
        }
    }
    
    public toNBFXArray(): Uint8Array {
        return this._dictString.toNBFXArray();
    }
    
    public toNative(): string {
        return this._dictString.toNative();
    }
    
    public getTextContent(escapeXML?: boolean): string {
        return this._dictString.toNBFXString();
    }
        
    constructor(value?: string | number | _DictionaryString) {
        super(DictionaryText._RecordType,
            DictionaryText._RecordTypeString);

        if (typeof value === "string" || typeof value === "number") {
            this._dictString = new _DictionaryString(value);
        } else if (value instanceof _DictionaryString) {
            this._dictString = value;
        }
    }
}