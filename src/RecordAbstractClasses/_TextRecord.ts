/// <reference path="../!ref.ts" />

abstract class _TextRecord extends _NBFXRecord {
    private _attachedElementRecord: _ElementRecord<any>;
    
    private _maxUint8Length: number;
    private _uint8: Uint8Array;   // Raw data stored here

    protected uint8MaxLength(length: number): this {
        this._maxUint8Length = length;
        return this;
    }

    protected uint8Length(): number {
        return this._uint8.byteLength;
    }
    
    protected uint8(arr?: Uint8Array): Uint8Array {
        if (arr) {
            if (this._maxUint8Length >= 0 && arr.byteLength > this._maxUint8Length) {
                throw new Error("Array too long");
            } 
            
            this._uint8 = arr;
            return this._uint8;
        }
        
        return this._uint8;
    }
    
    protected uint8DataView(): DataView {
        return $Uint8ArrayUtil.DataView(this.uint8());
    }
    
    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (this.uint8()) {
            return null;
        }
        
        return this.processNBFXArray(arr);
    }
    

    public attachToElementRecord(elementRecord: _ElementRecord<any>): this {
        this._attachedElementRecord = elementRecord;
        return this;
    }
    
    protected getAttachedElementRecord(): _ElementRecord<any> {
        return this._attachedElementRecord;
    }
    
    public hasAttachedElementRecord(): boolean {
        return ((this.getAttachedElementRecord()) ? true : false);
    }
    
    protected getAttachedElementRecordEndTag(): string {
        if (!this.getAttachedElementRecord()) { return ""; }
        
        return "</" + this.getAttachedElementRecord().getTagName() + ">";
    }
    
    public typeOf(): number {
        return super.typeOf() + ((this._attachedElementRecord) ? 0x01 : 0x00);
    }
    
    public typeString(): string {
        return super.typeString() + ((this._attachedElementRecord) ? "WithEndElement" : "");
    }
    
    
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string {
        return this.getTextContent(escapeXML) + this.getAttachedElementRecordEndTag();
    }
    
    public abstract getTextContent(escapeXML?: boolean): string;

    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);
        
        this._attachedElementRecord = null;
    }
}