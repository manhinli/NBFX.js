interface $INBFX {
    toNBFXArray(): Uint8Array;
    toNBFXString(escapeXML: boolean): string;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
}
interface $IConsumeNBFXArrayResult<T> {
    consumedBytes: number;
    remainingArray: Uint8Array;
    object: T;
}
declare class UnrecognisedRecordError extends Error {
    message: string;
    name: string;
    constructor(message?: string);
}
declare class $StringUtil {
    static PadLeft(str: string, length: number, padChar?: string): string;
}
declare class $NumberUtil {
    static IsNaN(value: number): boolean;
    static IsPosInf(value: number): boolean;
    static IsNegInf(value: number): boolean;
    static IsNegZero(value: number): boolean;
    static ToNBFXString(value: number, radix?: number): string;
}
declare class $Base64Util {
    static Uint8ArrayToBase64(arr: Uint8Array): string;
    static Base64toUint8Array(str: string): Uint8Array;
}
declare var escape: (str: string) => string;
declare class $UnicodeUtil {
    /**
     * Encodes string in JS (should be UTF-16) to UTF-8
     */
    static StringToUTF8Array(str: string): Uint8Array;
    static UTF8ArrayToString(arr: Uint8Array): string;
    static StringToUTF16Array(str: string, littleEndian?: boolean): Uint8Array;
    static UTF16ArrayToString(arr: Uint8Array, littleEndian?: boolean): string;
}
declare class $XmlEntityUtil {
    static Escape(str: string): string;
}
declare class $Uint8ArrayUtil {
    static Extract(arr: Uint8Array, bytes: number): Uint8Array;
    static Advance(arr: Uint8Array, bytes: number): Uint8Array;
    static ArrayToStringArray(arr: Uint8Array, radix?: number): Array<string>;
    static DataView(arr: Uint8Array): DataView;
}
declare class $PrefixSingleCharUtil {
    private static _Dictionary;
    static ValueToChar(value: number): string;
    static CharToValue(char: string): number;
}
declare abstract class _NBFXRecord implements $INBFX {
    private _recordType;
    private _recordTypeString;
    protected abstract processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected abstract generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNBFXString(escapeXML?: boolean): string;
    toString(radix?: number): string;
    abstract consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    abstract toNBFXArray(): Uint8Array;
    abstract toNative(): any;
    typeOf(): number;
    typeString(): string;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _BaseRecordType implements $INBFX {
    private _maxUint8Length;
    private _uint8;
    protected abstract processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected abstract generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNBFXString(escapeXML?: boolean): string;
    toString(radix?: number): string;
    abstract toNBFXArray(): Uint8Array;
    abstract toNative(): any;
    protected uint8MaxLength(length: number): this;
    protected uint8Length(): number;
    protected uint8(arr?: Uint8Array): Uint8Array;
    protected uint8DataView(): DataView;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
}
declare abstract class _TextRecord extends _NBFXRecord {
    private _attachedElementRecord;
    private _maxUint8Length;
    private _uint8;
    protected uint8MaxLength(length: number): this;
    protected uint8Length(): number;
    protected uint8(arr?: Uint8Array): Uint8Array;
    protected uint8DataView(): DataView;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    attachToElementRecord(elementRecord: _ElementRecord<any>): this;
    protected getAttachedElementRecord(): _ElementRecord<any>;
    hasAttachedElementRecord(): boolean;
    protected getAttachedElementRecordEndTag(): string;
    typeOf(): number;
    typeString(): string;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    abstract getTextContent(escapeXML?: boolean): string;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _EmptyDataText extends _TextRecord {
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _FixedLengthHeaderText extends _TextRecord {
    private _lengthHeaderBytes;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number);
}
declare abstract class _BytesNNText extends _FixedLengthHeaderText {
    protected saveBase64(b64: string): this;
    toNative(): any;
    getTextContent(escapeXML?: boolean): string;
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number);
}
declare abstract class _CharsNNText extends _FixedLengthHeaderText {
    protected saveUTF8(str: string): this;
    toNative(): any;
    getTextContent(escapeXML?: boolean): string;
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number);
}
declare abstract class _UnicodeCharsNNText extends _FixedLengthHeaderText {
    protected saveUTF16(str: string): this;
    toNative(): any;
    getTextContent(escapeXML?: boolean): string;
    constructor(recordType: number, recordTypeString: string, lengthHeaderBytes: number);
}
declare abstract class _FixedLengthText extends _TextRecord {
    private _length;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string, length: number);
}
declare abstract class _UuidText extends _FixedLengthText {
    private static _Length;
    toNative(): string;
    getTextContent(escapeXML?: boolean): string;
    constructor(_recordType: number, _recordTypeString: string);
}
declare abstract class _AttributeRecord<ValueType extends _TextRecord | _BaseRecordType> extends _NBFXRecord {
    private _value;
    protected static DetermineAttributeValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected getValue(): ValueType;
    protected saveValue(value: ValueType): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected abstract processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<ValueType>;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): string;
    abstract getAttributeName(): string;
    abstract getAttributeValue(escapeXML?: boolean): string;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _AttributeRecordWithName<NameType extends _BaseRecordType, ValueType extends _TextRecord> extends _AttributeRecord<ValueType> {
    private _name;
    protected getName(): NameType;
    protected saveName(name: NameType): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected abstract processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<NameType>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _AttributeRecordWithPrefixName<NameType extends _BaseRecordType, ValueType extends _TextRecord> extends _AttributeRecordWithName<NameType, ValueType> {
    private _prefix;
    protected getPrefix(): _String;
    protected savePrefix(prefix: _String): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _AttributeRecordXmlnsWithPrefix<ValueType extends _String | _DictionaryString> extends _AttributeRecord<ValueType> {
    private _prefix;
    protected getPrefix(): _String;
    protected savePrefix(prefix: _String): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _ElementRecord<NameType extends _String | _DictionaryString> extends _NBFXRecord {
    private _name;
    private _attributes;
    protected static DetermineElementAttributeFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_AttributeRecord<any>>;
    protected static ConsumeElementAttributesArrayFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<Array<_AttributeRecord<any>>>;
    getTagName(): string;
    protected getName(): NameType;
    protected saveName(name: NameType): this;
    getAttributes(): Array<_AttributeRecord<any>>;
    protected saveAttributes(arr: Array<_AttributeRecord<any>>): this;
    protected abstract processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<NameType>;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): string;
    constructor(recordType: number, recordTypeString: string);
}
declare abstract class _ElementRecordWithPrefix<NameType extends _String | _DictionaryString> extends _ElementRecord<NameType> {
    private _prefix;
    private _includesPrefixInNBFXArray;
    getTagName(): string;
    protected getPrefix(): _String;
    protected savePrefix(prefix: _String): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNBFXArray(): Uint8Array;
    constructor(recordType: number, recordTypeString: string, includesPrefixInNBFXArray?: boolean);
}
declare class _MultiByteInt31 extends _BaseRecordType {
    private _value;
    private static ArrayToValue(arr);
    private static DetectNumberOfBytes(arr);
    private numberOfBytes();
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): number;
    constructor(value?: number);
}
declare class _String extends _BaseRecordType {
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNBFXArray(): Uint8Array;
    toNative(): string;
    constructor(value?: string);
}
declare class _DictionaryString extends _BaseRecordType {
    private static _Dictionary;
    private _mbi31;
    static ValueToString(value: number): string;
    static StringToValue(str: string): number;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): string;
    constructor(value?: string | number | _MultiByteInt31);
}
declare class ZeroText extends _EmptyDataText {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor();
}
declare class OneText extends _EmptyDataText {
    static _RecordType: number;
    static _RecordTypeString: string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor();
}
declare class FalseText extends _EmptyDataText {
    static _RecordType: number;
    static _RecordTypeString: string;
    toNative(): boolean;
    getTextContent(escapeXML?: boolean): string;
    constructor();
}
declare class TrueText extends _EmptyDataText {
    static _RecordType: number;
    static _RecordTypeString: string;
    toNative(): boolean;
    getTextContent(escapeXML?: boolean): string;
    constructor();
}
declare class Int8Text extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor(num?: number);
}
declare class Int16Text extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor(num?: number);
}
declare class Int32Text extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor(num?: number);
}
declare class FloatText extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor(num?: number);
}
declare class DoubleText extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): number;
    getTextContent(escapeXML?: boolean): string;
    constructor(num?: number);
}
declare class Chars8Text extends _CharsNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(str?: string);
}
declare class Chars16Text extends _CharsNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(str?: string);
}
declare class Chars32Text extends _CharsNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(str?: string);
}
declare class Bytes8Text extends _BytesNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(b64?: string);
}
declare class Bytes16Text extends _BytesNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(b64?: string);
}
declare class Bytes32Text extends _BytesNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(b64?: string);
}
declare class EmptyText extends _EmptyDataText {
    static _RecordType: number;
    static _RecordTypeString: string;
    toNative(): string;
    getTextContent(escapeXML?: boolean): string;
    constructor();
}
declare class DictionaryText extends _TextRecord {
    static _RecordType: number;
    static _RecordTypeString: string;
    private _dictString;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): string;
    getTextContent(escapeXML?: boolean): string;
    constructor(value?: string | number | _DictionaryString);
}
declare class UniqueIdText extends _UuidText {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getTextContent(escapeXML?: boolean): string;
    constructor(arr?: Uint8Array);
}
declare class UuidText extends _UuidText {
    static _RecordType: number;
    static _RecordTypeString: string;
    constructor(arr?: Uint8Array);
}
declare class BoolText extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    private saveBooleanAsNumber(b);
    toNative(): boolean;
    getTextContent(escapeXML?: boolean): string;
    constructor(value?: boolean | number);
}
declare class UnicodeChars8Text extends _UnicodeCharsNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(str?: string);
}
declare class UnicodeChars16Text extends _UnicodeCharsNNText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _LengthHeaderBytes;
    constructor(str?: string);
}
declare class UnicodeChars32Text extends _TextRecord {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected saveUTF16(str: string): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    toNative(): any;
    getTextContent(escapeXML?: boolean): string;
    constructor(str?: string);
}
declare class QNameDictionaryText extends _FixedLengthText {
    static _RecordType: number;
    static _RecordTypeString: string;
    private static _Length;
    toNative(): string;
    getTextContent(escapeXML?: boolean): string;
    constructor(arr?: Uint8Array);
}
declare class ShortAttribute extends _AttributeRecordWithName<_String, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(name?: string | _String, value?: _TextRecord);
}
declare class Attribute extends _AttributeRecordWithPrefixName<_String, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    private saveNameValue(name, value);
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix?: string | _String, name?: string | _String, value?: _TextRecord);
}
declare class ShortDictionaryAttribute extends _AttributeRecordWithName<_DictionaryString, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(name?: string | _DictionaryString, value?: _TextRecord);
}
declare class DictionaryAttribute extends _AttributeRecordWithPrefixName<_DictionaryString, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    private saveNameValue(name, value);
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix?: string | _String, name?: string | _DictionaryString, value?: _TextRecord);
}
declare class ShortXmlnsAttribute extends _AttributeRecord<_String> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(value?: string | _String);
}
declare class XmlnsAttribute extends _AttributeRecordXmlnsWithPrefix<_String> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix?: string | _String, value?: _String);
}
declare class ShortDictionaryXmlnsAttribute extends _AttributeRecord<_DictionaryString> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(value?: string | _DictionaryString);
}
declare class DictionaryXmlnsAttribute extends _AttributeRecordXmlnsWithPrefix<_DictionaryString> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix?: string | _String, value?: _DictionaryString);
}
declare class PrefixDictionaryAttribute extends _AttributeRecordWithName<_DictionaryString, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    private _prefix;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix: string | number, name?: string | _DictionaryString, value?: _TextRecord);
}
declare class PrefixAttribute extends _AttributeRecordWithName<_String, _TextRecord> {
    static _RecordType: number;
    static _RecordTypeString: string;
    private _prefix;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected processValueFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_TextRecord>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    getAttributeName(): string;
    getAttributeValue(escapeXML?: boolean): string;
    constructor(prefix: string | number, name?: string | _String, value?: _TextRecord);
}
declare class ShortElement extends _ElementRecord<_String> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    constructor(name?: string | _String, attributes?: Array<_AttributeRecord<any>>);
}
declare class ElementRecord extends _ElementRecordWithPrefix<_String> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    constructor(name?: string | _String, attributes?: Array<_AttributeRecord<any>>);
}
declare class ShortDictionaryElement extends _ElementRecord<_DictionaryString> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    constructor(name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>);
}
declare class DictionaryElement extends _ElementRecordWithPrefix<_DictionaryString> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    constructor(name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>);
}
declare class PrefixDictionaryElement extends _ElementRecordWithPrefix<_DictionaryString> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_DictionaryString>;
    constructor(prefix: string | number, name?: string | _DictionaryString, attributes?: Array<_AttributeRecord<any>>);
}
declare class PrefixElement extends _ElementRecordWithPrefix<_String> {
    static _RecordType: number;
    static _RecordTypeString: string;
    protected processNameFromNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<_String>;
    constructor(prefix: string | number, name?: string | _String, attributes?: Array<_AttributeRecord<any>>);
}
declare class EndElement extends _NBFXRecord {
    static _RecordType: number;
    static _RecordTypeString: string;
    private _attachedElementRecord;
    attachToElementRecord(elementRecord: any): this;
    protected processNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    toNBFXArray(): Uint8Array;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>;
    protected generateNBFXStringRepresentation(radix?: number, escapeXML?: boolean): string;
    toNative(): string;
    constructor();
}
declare class NBFX {
    private _records;
    protected static DetermineRecordFromNBFXArray(arr: Uint8Array, elementStack: Array<_ElementRecord<any>>): $IConsumeNBFXArrayResult<_NBFXRecord>;
    fromUint8Array(arr: Uint8Array): this;
    getRecords(): Array<_NBFXRecord>;
    toNBFXString(escapeXML?: boolean): string;
    toXML(): Document;
    toString(): string;
    constructor();
}
