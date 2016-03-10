/// <reference path="./!ref.ts" />

class NBFX {
    private _records: Array<_NBFXRecord>;

    protected static DetermineRecordFromNBFXArray(arr: Uint8Array, elementStack: Array<_ElementRecord<any>>): $IConsumeNBFXArrayResult<_NBFXRecord> {
        var recordType: number = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var record: _NBFXRecord = null;

        // Text records
        switch (recordType & 0xFE) {
            // TODO: Change to use record type already defined statically in these constructors rather than hard coded points
            case 0x80: record = new ZeroText(); break;
            case 0x82: record = new OneText(); break;
            case 0x84: record = new FalseText(); break;
            case 0x86: record = new TrueText(); break;
            case 0x88: record = new Int8Text(); break;
            case 0x8A: record = new Int16Text(); break;
            case 0x8C: record = new Int32Text(); break;
            // case 0x8E: record = new Int64Text(); break;
            case 0x90: record = new FloatText(); break;
            case 0x92: record = new DoubleText(); break;
            // case 0x94: record = new DecimalText(); break;
            // case 0x96: record = new DateTimeText(); break;
            case 0x98: record = new Chars8Text(); break;
            case 0x9A: record = new Chars16Text(); break;
            case 0x9C: record = new Chars32Text(); break;
            case 0x9E: record = new Bytes8Text(); break;
            case 0xA0: record = new Bytes16Text(); break;
            case 0xA2: record = new Bytes32Text(); break;
            // case 0xA4: record = new StartListText(); break;
            // case 0xA6: record = new EndListText(); break;
            case 0xA8: record = new EmptyText(); break;
            case 0xAA: record = new DictionaryText(); break;
            case 0xAC: record = new UniqueIdText(); break;
            // case 0xAE: record = new TimeSpanText(); break;
            case 0xB0: record = new UuidText(); break;
            // case 0xB2: record = new UInt64Text(); break;
            case 0xB4: record = new BoolText(); break;
            case 0xB6: record = new UnicodeChars8Text(); break;
            case 0xB8: record = new UnicodeChars16Text(); break;
            case 0xBA: record = new UnicodeChars32Text(); break;
            case 0xBC: record = new QNameDictionaryText(); break;
        }

        // *TextWithEndElement
        if (record && (recordType & 0x01)) {
            (<_TextRecord>record).attachToElementRecord(elementStack.pop());
        }

        // Misc + element records
        if (!record) {
            switch (recordType) {
                // Misc
                case EndElement._RecordType:
                    record = new EndElement();
                    (<EndElement>record).attachToElementRecord(elementStack.pop());
                    break;
                // TODO: 0x02
                // TODO: 0x03
            
                // Std element
                case ShortElement._RecordType:
                    record = new ShortElement(); break;
                case ElementRecord._RecordType:
                    record = new ElementRecord(); break;
                case ShortDictionaryElement._RecordType:
                    record = new ShortDictionaryElement(); break;
                case DictionaryElement._RecordType:
                    record = new DictionaryElement(); break;
                // Prefix*Element, see below
            }
        }
        
        // Prefix*Element records
        if (!record) {
            // (a to z = 0 to 25)
            if (recordType >= PrefixDictionaryElement._RecordType) {
                if (recordType <= PrefixDictionaryElement._RecordType + 25) {
                    record = new PrefixDictionaryElement(recordType - PrefixDictionaryElement._RecordType);
                } else if (recordType <= PrefixElement._RecordType + 25) {
                    record = new PrefixElement(recordType - PrefixElement._RecordType);
                }
            }
        }

        if (!record) {
            throw new UnrecognisedRecordError("Unrecognised record type");
        }

        return {
            consumedBytes: 1,
            remainingArray: $Uint8ArrayUtil.Advance(arr, 1),
            object: record
        }
    }

    public fromUint8Array(arr: Uint8Array): this {
        if (this.getRecords().length > 0) {
            return this;
        }

        var elementStack: Array<_ElementRecord<any>> = [];

        var consumedBytes: number = 0;

        while (arr.byteLength > 0) {
            // Detect
            var recordTypeConsumeResult: $IConsumeNBFXArrayResult<_NBFXRecord> = NBFX.DetermineRecordFromNBFXArray(arr, elementStack);
            consumedBytes += recordTypeConsumeResult.consumedBytes;
            arr = recordTypeConsumeResult.remainingArray;
            
            // Process
            var record = recordTypeConsumeResult.object;
            var recordConsumeResult: $IConsumeNBFXArrayResult<_NBFXRecord> = record.consumeNBFXArray(arr);
            consumedBytes += recordConsumeResult.consumedBytes;
            arr = recordConsumeResult.remainingArray;
            
            // Push to stack if element
            if (record instanceof _ElementRecord) {
                elementStack.push(record);
            }
            
            // Save
            this._records.push(record);
        }

        console.log("Consumed " + consumedBytes + "B");

        return this;
    }

    public getRecords(): Array<_NBFXRecord> {
        return this._records;
    }

    public toNBFXString(escapeXML: boolean = false): string {
        var out: string = "";

        this._records.forEach((r) => {
            out += r.toNBFXString(escapeXML);
        });

        return out;
    }

    public toXML(): Document {
        var newDoc: Document = document.implementation.createDocument("", "", null);
        var elementStack: Array<Node> = [];

        var activeElement = () => { return elementStack[elementStack.length - 1]; };

        this._records.forEach((r) => {
            if (r instanceof _TextRecord) {
                activeElement().appendChild(newDoc.createTextNode(r.getTextContent(false)));
                
                // If terminated, pop
                if (r.hasAttachedElementRecord()) {
                    elementStack.pop();
                }
            } else if (r instanceof _ElementRecord) {
                // Push new element in
                var parent: Node = activeElement();
                if (!parent) { parent = newDoc; }
                
                elementStack.push(parent.appendChild(newDoc.createElement(r.getTagName())));
                
                // Append attributes
                r.getAttributes().forEach((a) => {
                    (<HTMLElement>activeElement()).setAttribute(a.getAttributeName(), a.getAttributeValue(false));
                });
            } else if (r instanceof EndElement) {
                // If terminated, pop
                elementStack.pop();
                
            // TODO: 
            // } else if (r instanceof _MISCELLANEOUSELEMENTS?) {
            //     // Do something
                
            } else {
                throw new UnrecognisedRecordError("Unrecognised record in document");
            }
        });

        return newDoc;
    }

    public toString(): string {
        if (this._records.length === 0) { return null; }
        
        return new XMLSerializer().serializeToString(this.toXML());
    }

    constructor() {
        this._records = new Array<_NBFXRecord>();
    }
}