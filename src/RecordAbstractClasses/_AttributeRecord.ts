/// <reference path="../!ref.ts" />

abstract class _AttributeRecord<ValueType extends _TextRecord | _BaseRecordType> extends _NBFXRecord {
    private _value: ValueType;

    protected static DetermineAttributeValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord> {
        var valueType: number = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var value: _TextRecord;


        // TODO: Change to use record type already defined statically in these constructors rather than hard coded points
        switch (valueType & 0xFE) {
            case 0x80: value = new ZeroText(); break;
            case 0x82: value = new OneText(); break;
            case 0x84: value = new FalseText(); break;
            case 0x86: value = new TrueText(); break;
            case 0x88: value = new Int8Text(); break;
            case 0x8A: value = new Int16Text(); break;
            case 0x8C: value = new Int32Text(); break;
            // case 0x8E: value = new Int64Text(); break;
            case 0x90: value = new FloatText(); break;
            case 0x92: value = new DoubleText(); break;
            // case 0x94: value = new DecimalText(); break;
            // case 0x96: value = new DateTimeText(); break;
            case 0x98: value = new Chars8Text(); break;
            case 0x9A: value = new Chars16Text(); break;
            case 0x9C: value = new Chars32Text(); break;
            case 0x9E: value = new Bytes8Text(); break;
            case 0xA0: value = new Bytes16Text(); break;
            case 0xA2: value = new Bytes32Text(); break;
            // case 0xA4: value = new StartListText(); break;
            // case 0xA6: value = new EndListText(); break;
            case 0xA8: value = new EmptyText(); break;
            case 0xAA: value = new DictionaryText(); break;
            case 0xAC: value = new UniqueIdText(); break;
            // case 0xAE: value = new TimeSpanText(); break;
            case 0xB0: value = new UuidText(); break;
            // case 0xB2: value = new UInt64Text(); break;
            case 0xB4: value = new BoolText(); break;
            case 0xB6: value = new UnicodeChars8Text(); break;
            case 0xB8: value = new UnicodeChars16Text(); break;
            case 0xBA: value = new UnicodeChars32Text(); break;
            case 0xBC: value = new QNameDictionaryText(); break;
            default: throw new UnrecognisedRecordError("Unrecognised text record type");
        }

        if (valueType & 0x01) {
            throw new Error("Cannot have \"" + value.typeString() + "WithEndElement\" text record in attribute");
        }

        return {
            consumedBytes: 1,
            remainingArray: $Uint8ArrayUtil.Advance(arr, 1),
            object: value
        }
    }

    protected getValue(): ValueType {
        return this._value;
    }

    protected saveValue(value: ValueType): this {
        if (typeof value === "undefined") {
            throw new Error("Invalid value");
        }
        
        this._value = value;
        return this;
    }

    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        if (!(this.getValue() === undefined)) { return null; }

        var valueConsumeResult: $IConsumeNBFXArrayResult<ValueType> = this.processValueFromNBFXArray(arr);

        this.saveValue(valueConsumeResult.object);

        return {
            consumedBytes: valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        }
    }

    protected abstract processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<ValueType>;

    public consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this> {
        return this.processNBFXArray(arr);
    }

    public toNBFXArray(): Uint8Array {
        return this.getValue().toNBFXArray();
    }

    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    public abstract getAttributeName(): string;
    public abstract getAttributeValue(escapeXML?: boolean): string;

    constructor(recordType: number, recordTypeString: string) {
        super(recordType, recordTypeString);
    }
}
