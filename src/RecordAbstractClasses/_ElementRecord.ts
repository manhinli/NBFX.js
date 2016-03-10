/// <reference path="../!ref.ts" />

abstract class _ElementRecord<NameType extends _String | _DictionaryString> extends _NBFXRecord {
    private _name: NameType;
    private _attributes: Array<_AttributeRecord<any>>;

    protected static DetermineElementAttributeFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_AttributeRecord<any>> {
        var attributeType: number = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var attribute: _AttributeRecord<any> = null;

        switch (attributeType) {
            case ShortAttribute._RecordType:
                attribute = new ShortAttribute(); break;
            case Attribute._RecordType:
                attribute = new Attribute(); break;
            case ShortDictionaryAttribute._RecordType:
                attribute = new ShortDictionaryAttribute(); break;
            case DictionaryAttribute._RecordType:
                attribute = new DictionaryAttribute(); break;
            case ShortXmlnsAttribute._RecordType:
                attribute = new ShortXmlnsAttribute(); break;
            case XmlnsAttribute._RecordType:
                attribute = new XmlnsAttribute(); break;
            case ShortDictionaryXmlnsAttribute._RecordType:
                attribute = new ShortDictionaryXmlnsAttribute(); break;
            case DictionaryXmlnsAttribute._RecordType:
                attribute = new DictionaryXmlnsAttribute(); break;
        }
        
        // PrefixAttribute, PrefixDictionaryAttribute
        // (a to z = 0 to 25)
        if (attributeType >= PrefixDictionaryAttribute._RecordType) {
            if (attributeType <= PrefixDictionaryAttribute._RecordType + 25) {
                attribute = new PrefixDictionaryAttribute(attributeType - PrefixDictionaryAttribute._RecordType);
            } else if (attributeType <= PrefixAttribute._RecordType + 25) {
                attribute = new PrefixAttribute(attributeType - PrefixAttribute._RecordType);
            }
        }

        // If none of the above attribute record types, then error
        if (!attribute) {
            // Disabling use of errors to improve performance
            // throw new UnrecognisedRecordError("Unrecognised attribute record type");
            return null;
        }

        return {
            consumedBytes: 1,
            remainingArray: $Uint8ArrayUtil.Advance(arr, 1),
            object: attribute
        }
    }

    protected static ConsumeElementAttributesArrayFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<Array<_AttributeRecord<any>>> {
        // Attribute search
        var attributesArray: Array<_AttributeRecord<any>> = [];
        var attributesConsumedBytes: number = 0;

        var attributeTypeConsumeResult: $IConsumeNBFXArrayResult<_AttributeRecord<any>>;
        var attributeConsumeResult: $IConsumeNBFXArrayResult<_AttributeRecord<any>>;
        var attribute: _AttributeRecord<any>;

        var processNextAttribute = () => {

        }
        
        // Loop until no more attributes found
        // try {
            while (true) {
                // Attribute type detect
                attributeTypeConsumeResult = _ElementRecord.DetermineElementAttributeFromNBFXArray(arr);
                
                // Stop if we've detected something that is not an element
                if (!attributeTypeConsumeResult) { break; }




                attribute = attributeTypeConsumeResult.object;

                attributesConsumedBytes += attributeTypeConsumeResult.consumedBytes;
                arr = attributeTypeConsumeResult.remainingArray;
                    
                // Attribute itself
                attributeConsumeResult = attribute.consumeNBFXArray(arr);

                attributesConsumedBytes += attributeConsumeResult.consumedBytes;
                arr = attributeConsumeResult.remainingArray;
                    
                // Push to array
                attributesArray.push(attributeConsumeResult.object);
            }
        // } catch (e) {
        //     if (e instanceof UnrecognisedRecordError) {
        //         // Do nothing - assumes that unrecognised record implies end of element block
        //     } else {
        //         // Throw error up
        //         throw e;
        //     }
        // }

        return {
            consumedBytes: attributesConsumedBytes,
            remainingArray: arr,
            object: attributesArray
        }
    }

    public getTagName(): string {
        return this.getName().toNBFXString();
    }

    protected getName(): NameType {
        return this._name;
    }

    protected saveName(name: NameType): this {
        if (name.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for attributes");
        }

        if (typeof name === "undefined") {
            throw new Error("Invalid name");
        }

        if (name.toString().length === 0) {
            throw new Error("Length of name must be nonzero");
        }

        this._name = name;
        return this;
    }

    public getAttributes(): Array<_AttributeRecord<any>> {
        return this._attributes;
    }

    protected saveAttributes(arr: Array<_AttributeRecord<any>>): this {
        if (!arr) {
            return this;
        }

        this._attributes = arr;
        return this;
    }

    protected abstract processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<NameType>;

    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (!(this.getName() === undefined)) { return null; }

        var nameConsumeResult: $IConsumeNBFXArrayResult<NameType> = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;

        var attributesArrayConsumeResult: $IConsumeNBFXArrayResult<Array<_AttributeRecord<any>>> = _ElementRecord.ConsumeElementAttributesArrayFromNBFXArray(arr);

        this.saveName(nameConsumeResult.object);
        this.saveAttributes(attributesArrayConsumeResult.object);

        return {
            consumedBytes: nameConsumeResult.consumedBytes + attributesArrayConsumeResult.consumedBytes,
            remainingArray: attributesArrayConsumeResult.remainingArray,
            object: this
        }
    }

    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        return this.processNBFXArray(arr);
    }

    public toNBFXArray(): Uint8Array {
        var nameBytes: Uint8Array = this.getName().toNBFXArray();
        var attributeBytesArray: Array<Uint8Array> = this.getAttributes().map((a) => { return a.toNBFXArray(); });

        var totalAttributesByteLength: number = 0;
        attributeBytesArray.forEach((v) => {
            totalAttributesByteLength += v.byteLength;
        })

        var totalOutArrayByteLength: number = nameBytes.byteLength + totalAttributesByteLength;


        // Out array is generated by concat'ing all attributes in 
        var out: Uint8Array = new Uint8Array(totalOutArrayByteLength);

        var offset: number = 0;

        out.set(nameBytes, 0);
        offset += nameBytes.byteLength;

        var attributeIndex: number = 0;
        var attributeBytes: Uint8Array;

        while (offset < totalOutArrayByteLength) {
            attributeBytes = attributeBytesArray[attributeIndex++];
            out.set(attributeBytes, offset);
            offset += attributeBytes.byteLength;
        }

        return out;
    }

    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);

        this.saveAttributes([]);
    }
}