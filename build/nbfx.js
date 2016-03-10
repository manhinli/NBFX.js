/// <reference path="../!ref.ts" />
/// <reference path="../!ref.ts" />
/// <reference path="$IBytes.ts" />
/// <reference path="$IConsumeNBFXArrayResult.ts" /> 
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UnrecognisedRecordError = (function (_super) {
    __extends(UnrecognisedRecordError, _super);
    function UnrecognisedRecordError(message) {
        _super.call(this, message);
        this.message = message;
        this.name = "UnrecognisedRecordError";
    }
    return UnrecognisedRecordError;
})(Error);
/// <reference path="UnrecognisedTypeError.ts" /> 
/// <reference path="../!ref.ts" />
var $StringUtil = (function () {
    function $StringUtil() {
    }
    $StringUtil.PadLeft = function (str, length, padChar) {
        if (padChar === void 0) { padChar = "0"; }
        while (str.length < length) {
            str = padChar + str;
        }
        return str;
    };
    return $StringUtil;
})();
/// <reference path="../!ref.ts" />
var $NumberUtil = (function () {
    function $NumberUtil() {
    }
    $NumberUtil.IsNaN = function (value) {
        return isNaN(value);
    };
    $NumberUtil.IsPosInf = function (value) {
        return (value === Number.POSITIVE_INFINITY);
    };
    $NumberUtil.IsNegInf = function (value) {
        return (value === Number.NEGATIVE_INFINITY);
    };
    $NumberUtil.IsNegZero = function (value) {
        return (value === 0 && 1 / value === Number.NEGATIVE_INFINITY);
    };
    $NumberUtil.ToNBFXString = function (value, radix) {
        if (radix === void 0) { radix = 10; }
        if ($NumberUtil.IsPosInf(value)) {
            return "INF";
        }
        if ($NumberUtil.IsNegInf(value)) {
            return "-INF";
        }
        if ($NumberUtil.IsNaN(value)) {
            return "NaN";
        }
        if ($NumberUtil.IsNegZero(value)) {
            return "-0";
        }
        return value.toString(radix);
    };
    return $NumberUtil;
})();
/// <reference path="../!ref.ts" />
var $Base64Util = (function () {
    function $Base64Util() {
    }
    // http://stackoverflow.com/a/25644409
    $Base64Util.Uint8ArrayToBase64 = function (arr) {
        var CHUNK_SIZE = 0x8000;
        var index = 0;
        var length = arr.length;
        var result = '';
        var slice;
        while (index < length) {
            slice = arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return btoa(result);
    };
    // http://stackoverflow.com/a/12713326
    $Base64Util.Base64toUint8Array = function (str) {
        return new Uint8Array(atob(str).split("").map(function (c) { return c.charCodeAt(0); }));
    };
    return $Base64Util;
})();
/// <reference path="../!ref.ts" />
var $UnicodeUtil = (function () {
    function $UnicodeUtil() {
    }
    /**
     * Encodes string in JS (should be UTF-16) to UTF-8
     */
    // http://stackoverflow.com/a/18729931 (faster)
    $UnicodeUtil.StringToUTF8Array = function (str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80)
                utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return new Uint8Array(utf8);
    };
    // http://stackoverflow.com/a/17192845
    // TODO: May have problems with stack?
    $UnicodeUtil.UTF8ArrayToString = function (arr) {
        var encodedString = String.fromCharCode.apply(null, arr);
        return decodeURIComponent(escape(encodedString));
    };
    $UnicodeUtil.StringToUTF16Array = function (str, littleEndian) {
        var out = new Uint8Array(str.length * 2);
        var dataView = $Uint8ArrayUtil.DataView(out);
        for (var i = 0; i < str.length; ++i) {
            var charcode = str.charCodeAt(i);
            dataView.setUint16(i * 2, charcode, littleEndian);
        }
        return out;
    };
    $UnicodeUtil.UTF16ArrayToString = function (arr, littleEndian) {
        var out = "";
        if (arr.byteLength % 2) {
            throw new Error("Array not even length");
        }
        var dataView = $Uint8ArrayUtil.DataView(arr);
        for (var i = 0; i < arr.byteLength; i += 2) {
            out += String.fromCharCode(dataView.getUint16(i, littleEndian));
        }
        return out;
    };
    return $UnicodeUtil;
})();
/// <reference path="../!ref.ts" />
var $XmlEntityUtil = (function () {
    function $XmlEntityUtil() {
    }
    // http://stackoverflow.com/a/27979933 
    $XmlEntityUtil.Escape = function (str) {
        return str.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    };
    return $XmlEntityUtil;
})();
/// <reference path="../!ref.ts" />
var $Uint8ArrayUtil = (function () {
    function $Uint8ArrayUtil() {
    }
    $Uint8ArrayUtil.Extract = function (arr, bytes) {
        return arr.subarray(0, bytes);
    };
    $Uint8ArrayUtil.Advance = function (arr, bytes) {
        return arr.subarray(bytes);
    };
    $Uint8ArrayUtil.ArrayToStringArray = function (arr, radix) {
        if (radix === void 0) { radix = 16; }
        var outStringArray = new Array();
        for (var i = 0; i < arr.length; ++i) {
            outStringArray.push(arr[i].toString(radix));
        }
        return outStringArray;
    };
    $Uint8ArrayUtil.DataView = function (arr) {
        return new DataView(arr.buffer, arr.byteOffset);
    };
    return $Uint8ArrayUtil;
})();
/// <reference path="../!ref.ts" />
var $PrefixSingleCharUtil = (function () {
    function $PrefixSingleCharUtil() {
    }
    $PrefixSingleCharUtil.ValueToChar = function (value) {
        var char = $PrefixSingleCharUtil._Dictionary[value];
        if (!char) {
            throw new Error("Character index value not valid");
        }
        return char;
    };
    $PrefixSingleCharUtil.CharToValue = function (char) {
        var value = $PrefixSingleCharUtil._Dictionary.indexOf(char);
        if (value < 0) {
            throw new Error("Character value not found");
        }
        return value;
    };
    $PrefixSingleCharUtil._Dictionary = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
    ];
    return $PrefixSingleCharUtil;
})();
/// <reference path="$StringUtil.ts" />
/// <reference path="$NumberUtil.ts" />
/// <reference path="$Base64Util.ts" />
/// <reference path="$UnicodeUtil.ts" />
/// <reference path="$XmlEntityUtil.ts" />
/// <reference path="$Uint8ArrayUtil.ts" />
/// <reference path="$PrefixSingleCharUtil.ts" />
/// <reference path="../!ref.ts" />
var _NBFXRecord = (function () {
    function _NBFXRecord(recordType, recordTypeString) {
        this._recordType = recordType;
        this._recordTypeString = recordTypeString;
    }
    _NBFXRecord.prototype.toNBFXString = function (escapeXML) {
        if (escapeXML === void 0) { escapeXML = false; }
        return this.generateNBFXStringRepresentation(undefined, escapeXML);
    };
    _NBFXRecord.prototype.toString = function (radix) {
        return this.generateNBFXStringRepresentation(radix);
    };
    _NBFXRecord.prototype.typeOf = function () {
        return this._recordType;
    };
    _NBFXRecord.prototype.typeString = function () {
        return this._recordTypeString;
    };
    return _NBFXRecord;
})();
/// <reference path="../!ref.ts" />
var _BaseRecordType = (function () {
    function _BaseRecordType() {
    }
    _BaseRecordType.prototype.toNBFXString = function (escapeXML) {
        if (escapeXML === void 0) { escapeXML = false; }
        return this.generateNBFXStringRepresentation(undefined, escapeXML);
    };
    _BaseRecordType.prototype.toString = function (radix) {
        return this.generateNBFXStringRepresentation(radix);
    };
    _BaseRecordType.prototype.uint8MaxLength = function (length) {
        this._maxUint8Length = length;
        return this;
    };
    _BaseRecordType.prototype.uint8Length = function () {
        return this._uint8.byteLength;
    };
    _BaseRecordType.prototype.uint8 = function (arr) {
        if (arr) {
            if (this._maxUint8Length >= 0 && arr.byteLength > this._maxUint8Length) {
                throw new Error("Array too long");
            }
            this._uint8 = arr;
            return this._uint8;
        }
        return this._uint8;
    };
    _BaseRecordType.prototype.uint8DataView = function () {
        return $Uint8ArrayUtil.DataView(this.uint8());
    };
    _BaseRecordType.prototype.consumeNBFXArray = function (arr) {
        if (this.uint8()) {
            return null;
        }
        return this.processNBFXArray(arr);
    };
    return _BaseRecordType;
})();
/// <reference path="../!ref.ts" />
var _TextRecord = (function (_super) {
    __extends(_TextRecord, _super);
    function _TextRecord(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
        this._attachedElementRecord = null;
    }
    _TextRecord.prototype.uint8MaxLength = function (length) {
        this._maxUint8Length = length;
        return this;
    };
    _TextRecord.prototype.uint8Length = function () {
        return this._uint8.byteLength;
    };
    _TextRecord.prototype.uint8 = function (arr) {
        if (arr) {
            if (this._maxUint8Length >= 0 && arr.byteLength > this._maxUint8Length) {
                throw new Error("Array too long");
            }
            this._uint8 = arr;
            return this._uint8;
        }
        return this._uint8;
    };
    _TextRecord.prototype.uint8DataView = function () {
        return $Uint8ArrayUtil.DataView(this.uint8());
    };
    _TextRecord.prototype.consumeNBFXArray = function (arr) {
        if (this.uint8()) {
            return null;
        }
        return this.processNBFXArray(arr);
    };
    _TextRecord.prototype.attachToElementRecord = function (elementRecord) {
        this._attachedElementRecord = elementRecord;
        return this;
    };
    _TextRecord.prototype.getAttachedElementRecord = function () {
        return this._attachedElementRecord;
    };
    _TextRecord.prototype.hasAttachedElementRecord = function () {
        return ((this.getAttachedElementRecord()) ? true : false);
    };
    _TextRecord.prototype.getAttachedElementRecordEndTag = function () {
        if (!this.getAttachedElementRecord()) {
            return "";
        }
        return "</" + this.getAttachedElementRecord().getTagName() + ">";
    };
    _TextRecord.prototype.typeOf = function () {
        return _super.prototype.typeOf.call(this) + ((this._attachedElementRecord) ? 0x01 : 0x00);
    };
    _TextRecord.prototype.typeString = function () {
        return _super.prototype.typeString.call(this) + ((this._attachedElementRecord) ? "WithEndElement" : "");
    };
    _TextRecord.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return this.getTextContent(escapeXML) + this.getAttachedElementRecordEndTag();
    };
    return _TextRecord;
})(_NBFXRecord);
/// <reference path="../!ref.ts" />
var _EmptyDataText = (function (_super) {
    __extends(_EmptyDataText, _super);
    function _EmptyDataText(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
    }
    _EmptyDataText.prototype.processNBFXArray = function (arr) {
        return {
            consumedBytes: 0,
            remainingArray: arr,
            object: this
        };
    };
    _EmptyDataText.prototype.toNBFXArray = function () {
        return new Uint8Array(0);
    };
    return _EmptyDataText;
})(_TextRecord);
/// <reference path="../!ref.ts" />
var _FixedLengthHeaderText = (function (_super) {
    __extends(_FixedLengthHeaderText, _super);
    function _FixedLengthHeaderText(recordType, recordTypeString, lengthHeaderBytes) {
        _super.call(this, recordType, recordTypeString);
        this._lengthHeaderBytes = lengthHeaderBytes;
    }
    _FixedLengthHeaderText.prototype.processNBFXArray = function (arr) {
        var stringLength = 0;
        var dataView = $Uint8ArrayUtil.DataView(arr);
        // Little endian
        for (var i = this._lengthHeaderBytes - 1; i >= 0; --i) {
            stringLength <<= 8;
            stringLength |= dataView.getUint8(i);
        }
        arr = $Uint8ArrayUtil.Advance(arr, this._lengthHeaderBytes);
        var consumedBytesArray = $Uint8ArrayUtil.Extract(arr, stringLength);
        var remainingBytesArray = $Uint8ArrayUtil.Advance(arr, stringLength);
        this.uint8(consumedBytesArray);
        return {
            consumedBytes: this._lengthHeaderBytes + consumedBytesArray.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        };
    };
    _FixedLengthHeaderText.prototype.toNBFXArray = function () {
        var out = new Uint8Array(this._lengthHeaderBytes + this.uint8Length());
        var dataView = $Uint8ArrayUtil.DataView(out);
        // Little endian
        var valueToWrite = this.uint8Length();
        for (var i = 0; i < this._lengthHeaderBytes; ++i) {
            dataView.setUint8(i, valueToWrite & 0xFF);
            valueToWrite >>>= 8;
        }
        out.set(this.uint8(), this._lengthHeaderBytes);
        return out;
    };
    return _FixedLengthHeaderText;
})(_TextRecord);
/// <reference path="../!ref.ts" />
var _BytesNNText = (function (_super) {
    __extends(_BytesNNText, _super);
    function _BytesNNText(recordType, recordTypeString, lengthHeaderBytes) {
        _super.call(this, recordType, recordTypeString, lengthHeaderBytes);
    }
    _BytesNNText.prototype.saveBase64 = function (b64) {
        this.uint8($Base64Util.Base64toUint8Array(b64));
        return this;
    };
    _BytesNNText.prototype.toNative = function () {
        return this.uint8();
    };
    _BytesNNText.prototype.getTextContent = function (escapeXML) {
        return $Base64Util.Uint8ArrayToBase64(this.uint8());
    };
    return _BytesNNText;
})(_FixedLengthHeaderText);
/// <reference path="../!ref.ts" />
var _CharsNNText = (function (_super) {
    __extends(_CharsNNText, _super);
    function _CharsNNText(recordType, recordTypeString, lengthHeaderBytes) {
        _super.call(this, recordType, recordTypeString, lengthHeaderBytes);
    }
    _CharsNNText.prototype.saveUTF8 = function (str) {
        this.uint8($UnicodeUtil.StringToUTF8Array(str));
        return this;
    };
    _CharsNNText.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    _CharsNNText.prototype.getTextContent = function (escapeXML) {
        var out = $UnicodeUtil.UTF8ArrayToString(this.uint8());
        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        return out;
    };
    return _CharsNNText;
})(_FixedLengthHeaderText);
/// <reference path="../!ref.ts" />
var _UnicodeCharsNNText = (function (_super) {
    __extends(_UnicodeCharsNNText, _super);
    function _UnicodeCharsNNText(recordType, recordTypeString, lengthHeaderBytes) {
        _super.call(this, recordType, recordTypeString, lengthHeaderBytes);
    }
    _UnicodeCharsNNText.prototype.saveUTF16 = function (str) {
        this.uint8($UnicodeUtil.StringToUTF16Array(str, true));
        return this;
    };
    _UnicodeCharsNNText.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    _UnicodeCharsNNText.prototype.getTextContent = function (escapeXML) {
        var out = $UnicodeUtil.UTF16ArrayToString(this.uint8(), true);
        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        return out;
    };
    return _UnicodeCharsNNText;
})(_FixedLengthHeaderText);
/// <reference path="../!ref.ts" />
var _FixedLengthText = (function (_super) {
    __extends(_FixedLengthText, _super);
    function _FixedLengthText(recordType, recordTypeString, length) {
        _super.call(this, recordType, recordTypeString);
        this._length = length;
        this.uint8MaxLength(this._length);
    }
    _FixedLengthText.prototype.processNBFXArray = function (arr) {
        var consumedBytesArray = $Uint8ArrayUtil.Extract(arr, this._length);
        var remainingBytesArray = $Uint8ArrayUtil.Advance(arr, this._length);
        this.uint8(consumedBytesArray);
        return {
            consumedBytes: consumedBytesArray.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        };
    };
    _FixedLengthText.prototype.toNBFXArray = function () {
        if (this.uint8Length() != this._length) {
            throw new Error("Mismatched byte length");
        }
        return this.uint8();
    };
    return _FixedLengthText;
})(_TextRecord);
/// <reference path="../!ref.ts" />
var _UuidText = (function (_super) {
    __extends(_UuidText, _super);
    function _UuidText(_recordType, _recordTypeString) {
        _super.call(this, _recordType, _recordTypeString, _UuidText._Length);
    }
    _UuidText.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    _UuidText.prototype.getTextContent = function (escapeXML) {
        var dataView = this.uint8DataView();
        var data1 = dataView.getUint32(0, true);
        var data2 = dataView.getUint16(4, true);
        var data3 = dataView.getUint16(6, true);
        var data4_1 = dataView.getUint8(8);
        var data4_2 = dataView.getUint8(9);
        var data4_3 = dataView.getUint8(10);
        var data4_4 = dataView.getUint8(11);
        var data4_5 = dataView.getUint8(12);
        var data4_6 = dataView.getUint8(13);
        var data4_7 = dataView.getUint8(14);
        var data4_8 = dataView.getUint8(15);
        return $StringUtil.PadLeft(data1.toString(16), 8) + "-" +
            $StringUtil.PadLeft(data2.toString(16), 4) + "-" +
            $StringUtil.PadLeft(data3.toString(16), 4) + "-" +
            $StringUtil.PadLeft(data4_1.toString(16), 2) +
            $StringUtil.PadLeft(data4_2.toString(16), 2) + "-" +
            $StringUtil.PadLeft(data4_3.toString(16), 2) +
            $StringUtil.PadLeft(data4_4.toString(16), 2) +
            $StringUtil.PadLeft(data4_5.toString(16), 2) +
            $StringUtil.PadLeft(data4_6.toString(16), 2) +
            $StringUtil.PadLeft(data4_7.toString(16), 2) +
            $StringUtil.PadLeft(data4_8.toString(16), 2);
    };
    _UuidText._Length = 16;
    return _UuidText;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var _AttributeRecord = (function (_super) {
    __extends(_AttributeRecord, _super);
    function _AttributeRecord(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
    }
    _AttributeRecord.DetermineAttributeValueFromNBFXArray = function (arr) {
        var valueType = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var value;
        // TODO: Change to use record type already defined statically in these constructors rather than hard coded points
        switch (valueType & 0xFE) {
            case 0x80:
                value = new ZeroText();
                break;
            case 0x82:
                value = new OneText();
                break;
            case 0x84:
                value = new FalseText();
                break;
            case 0x86:
                value = new TrueText();
                break;
            case 0x88:
                value = new Int8Text();
                break;
            case 0x8A:
                value = new Int16Text();
                break;
            case 0x8C:
                value = new Int32Text();
                break;
            // case 0x8E: value = new Int64Text(); break;
            case 0x90:
                value = new FloatText();
                break;
            case 0x92:
                value = new DoubleText();
                break;
            // case 0x94: value = new DecimalText(); break;
            // case 0x96: value = new DateTimeText(); break;
            case 0x98:
                value = new Chars8Text();
                break;
            case 0x9A:
                value = new Chars16Text();
                break;
            case 0x9C:
                value = new Chars32Text();
                break;
            case 0x9E:
                value = new Bytes8Text();
                break;
            case 0xA0:
                value = new Bytes16Text();
                break;
            case 0xA2:
                value = new Bytes32Text();
                break;
            // case 0xA4: value = new StartListText(); break;
            // case 0xA6: value = new EndListText(); break;
            case 0xA8:
                value = new EmptyText();
                break;
            case 0xAA:
                value = new DictionaryText();
                break;
            case 0xAC:
                value = new UniqueIdText();
                break;
            // case 0xAE: value = new TimeSpanText(); break;
            case 0xB0:
                value = new UuidText();
                break;
            // case 0xB2: value = new UInt64Text(); break;
            case 0xB4:
                value = new BoolText();
                break;
            case 0xB6:
                value = new UnicodeChars8Text();
                break;
            case 0xB8:
                value = new UnicodeChars16Text();
                break;
            case 0xBA:
                value = new UnicodeChars32Text();
                break;
            case 0xBC:
                value = new QNameDictionaryText();
                break;
            default: throw new UnrecognisedRecordError("Unrecognised text record type");
        }
        if (valueType & 0x01) {
            throw new Error("Cannot have \"" + value.typeString() + "WithEndElement\" text record in attribute");
        }
        return {
            consumedBytes: 1,
            remainingArray: $Uint8ArrayUtil.Advance(arr, 1),
            object: value
        };
    };
    _AttributeRecord.prototype.getValue = function () {
        return this._value;
    };
    _AttributeRecord.prototype.saveValue = function (value) {
        if (typeof value === "undefined") {
            throw new Error("Invalid value");
        }
        this._value = value;
        return this;
    };
    _AttributeRecord.prototype.processNBFXArray = function (arr) {
        if (!(this.getValue() === undefined)) {
            return null;
        }
        var valueConsumeResult = this.processValueFromNBFXArray(arr);
        this.saveValue(valueConsumeResult.object);
        return {
            consumedBytes: valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        };
    };
    _AttributeRecord.prototype.consumeNBFXArray = function (arr) {
        return this.processNBFXArray(arr);
    };
    _AttributeRecord.prototype.toNBFXArray = function () {
        return this.getValue().toNBFXArray();
    };
    _AttributeRecord.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    return _AttributeRecord;
})(_NBFXRecord);
/// <reference path="../!ref.ts" />
var _AttributeRecordWithName = (function (_super) {
    __extends(_AttributeRecordWithName, _super);
    function _AttributeRecordWithName(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
    }
    _AttributeRecordWithName.prototype.getName = function () {
        return this._name;
    };
    _AttributeRecordWithName.prototype.saveName = function (name) {
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
    };
    _AttributeRecordWithName.prototype.processNBFXArray = function (arr) {
        if (!(this.getName() === undefined) || !(this.getValue() === undefined)) {
            return null;
        }
        var nameConsumeResult = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;
        var valueConsumeResult = this.processValueFromNBFXArray(arr);
        this.saveName(nameConsumeResult.object);
        this.saveValue(valueConsumeResult.object);
        return {
            consumedBytes: nameConsumeResult.consumedBytes + valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        };
    };
    _AttributeRecordWithName.prototype.toNBFXArray = function () {
        var nameBytes = this.getName().toNBFXArray();
        var valueBytes = this.getValue().toNBFXArray();
        var out = new Uint8Array(nameBytes.byteLength + valueBytes.byteLength);
        out.set(nameBytes, 0);
        out.set(valueBytes, nameBytes.byteLength);
        return out;
    };
    return _AttributeRecordWithName;
})(_AttributeRecord);
/// <reference path="../!ref.ts" />
var _AttributeRecordWithPrefixName = (function (_super) {
    __extends(_AttributeRecordWithPrefixName, _super);
    function _AttributeRecordWithPrefixName(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
    }
    _AttributeRecordWithPrefixName.prototype.getPrefix = function () {
        return this._prefix;
    };
    _AttributeRecordWithPrefixName.prototype.savePrefix = function (prefix) {
        if (prefix.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for prefixes");
        }
        if (typeof prefix === "undefined") {
            throw new Error("Invalid prefix");
        }
        if (prefix.toString().length === 0) {
            throw new Error("Length of prefix must be nonzero");
        }
        this._prefix = prefix;
        return this;
    };
    _AttributeRecordWithPrefixName.prototype.processNBFXArray = function (arr) {
        if (!(this.getPrefix() === undefined) || !(this.getName() === undefined) || !(this.getValue() === undefined)) {
            return null;
        }
        var prefix = new _String();
        var prefixConsumeResult = prefix.consumeNBFXArray(arr);
        arr = prefixConsumeResult.remainingArray;
        var nameConsumeResult = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;
        var valueConsumeResult = this.processValueFromNBFXArray(arr);
        this.savePrefix(prefixConsumeResult.object);
        this.saveName(nameConsumeResult.object);
        this.saveValue(valueConsumeResult.object);
        return {
            consumedBytes: prefixConsumeResult.consumedBytes + nameConsumeResult.consumedBytes + valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        };
    };
    _AttributeRecordWithPrefixName.prototype.toNBFXArray = function () {
        var prefixBytes = this.getPrefix().toNBFXArray();
        var nameBytes = this.getName().toNBFXArray();
        var valueBytes = this.getValue().toNBFXArray();
        var out = new Uint8Array(prefixBytes.byteLength + nameBytes.byteLength + valueBytes.byteLength);
        out.set(prefixBytes, 0);
        out.set(nameBytes, prefixBytes.byteLength);
        out.set(valueBytes, prefixBytes.byteLength + nameBytes.byteLength);
        return out;
    };
    return _AttributeRecordWithPrefixName;
})(_AttributeRecordWithName);
/// <reference path="../!ref.ts" />
var _AttributeRecordXmlnsWithPrefix = (function (_super) {
    __extends(_AttributeRecordXmlnsWithPrefix, _super);
    function _AttributeRecordXmlnsWithPrefix(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
    }
    _AttributeRecordXmlnsWithPrefix.prototype.getPrefix = function () {
        return this._prefix;
    };
    _AttributeRecordXmlnsWithPrefix.prototype.savePrefix = function (prefix) {
        if (prefix.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for prefixes");
        }
        if (typeof prefix === "undefined") {
            throw new Error("Invalid prefix");
        }
        if (prefix.toString().length === 0) {
            throw new Error("Length of prefix must be nonzero");
        }
        this._prefix = prefix;
        return this;
    };
    _AttributeRecordXmlnsWithPrefix.prototype.processNBFXArray = function (arr) {
        if (!(this.getPrefix() === undefined) || !(this.getValue() === undefined)) {
            return null;
        }
        var prefix = new _String();
        var prefixConsumeResult = prefix.consumeNBFXArray(arr);
        arr = prefixConsumeResult.remainingArray;
        var valueConsumeResult = this.processValueFromNBFXArray(arr);
        this.savePrefix(prefixConsumeResult.object);
        this.saveValue(valueConsumeResult.object);
        return {
            consumedBytes: prefixConsumeResult.consumedBytes + valueConsumeResult.consumedBytes,
            remainingArray: valueConsumeResult.remainingArray,
            object: this
        };
    };
    _AttributeRecordXmlnsWithPrefix.prototype.toNBFXArray = function () {
        var prefixBytes = this.getPrefix().toNBFXArray();
        var valueBytes = this.getValue().toNBFXArray();
        var out = new Uint8Array(prefixBytes.byteLength + valueBytes.byteLength);
        out.set(prefixBytes, 0);
        out.set(valueBytes, prefixBytes.byteLength);
        return out;
    };
    return _AttributeRecordXmlnsWithPrefix;
})(_AttributeRecord);
/// <reference path="../!ref.ts" />
var _ElementRecord = (function (_super) {
    __extends(_ElementRecord, _super);
    function _ElementRecord(recordType, recordTypeString) {
        _super.call(this, recordType, recordTypeString);
        this.saveAttributes([]);
    }
    _ElementRecord.DetermineElementAttributeFromNBFXArray = function (arr) {
        var attributeType = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var attribute = null;
        switch (attributeType) {
            case ShortAttribute._RecordType:
                attribute = new ShortAttribute();
                break;
            case Attribute._RecordType:
                attribute = new Attribute();
                break;
            case ShortDictionaryAttribute._RecordType:
                attribute = new ShortDictionaryAttribute();
                break;
            case DictionaryAttribute._RecordType:
                attribute = new DictionaryAttribute();
                break;
            case ShortXmlnsAttribute._RecordType:
                attribute = new ShortXmlnsAttribute();
                break;
            case XmlnsAttribute._RecordType:
                attribute = new XmlnsAttribute();
                break;
            case ShortDictionaryXmlnsAttribute._RecordType:
                attribute = new ShortDictionaryXmlnsAttribute();
                break;
            case DictionaryXmlnsAttribute._RecordType:
                attribute = new DictionaryXmlnsAttribute();
                break;
        }
        // PrefixAttribute, PrefixDictionaryAttribute
        // (a to z = 0 to 25)
        if (attributeType >= PrefixDictionaryAttribute._RecordType) {
            if (attributeType <= PrefixDictionaryAttribute._RecordType + 25) {
                attribute = new PrefixDictionaryAttribute(attributeType - PrefixDictionaryAttribute._RecordType);
            }
            else if (attributeType <= PrefixAttribute._RecordType + 25) {
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
        };
    };
    _ElementRecord.ConsumeElementAttributesArrayFromNBFXArray = function (arr) {
        // Attribute search
        var attributesArray = [];
        var attributesConsumedBytes = 0;
        var attributeTypeConsumeResult;
        var attributeConsumeResult;
        var attribute;
        var processNextAttribute = function () {
        };
        // Loop until no more attributes found
        // try {
        while (true) {
            // Attribute type detect
            attributeTypeConsumeResult = _ElementRecord.DetermineElementAttributeFromNBFXArray(arr);
            // Stop if we've detected something that is not an element
            if (!attributeTypeConsumeResult) {
                break;
            }
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
        };
    };
    _ElementRecord.prototype.getTagName = function () {
        return this.getName().toNBFXString();
    };
    _ElementRecord.prototype.getName = function () {
        return this._name;
    };
    _ElementRecord.prototype.saveName = function (name) {
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
    };
    _ElementRecord.prototype.getAttributes = function () {
        return this._attributes;
    };
    _ElementRecord.prototype.saveAttributes = function (arr) {
        if (!arr) {
            return this;
        }
        this._attributes = arr;
        return this;
    };
    _ElementRecord.prototype.processNBFXArray = function (arr) {
        if (!(this.getName() === undefined)) {
            return null;
        }
        var nameConsumeResult = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;
        var attributesArrayConsumeResult = _ElementRecord.ConsumeElementAttributesArrayFromNBFXArray(arr);
        this.saveName(nameConsumeResult.object);
        this.saveAttributes(attributesArrayConsumeResult.object);
        return {
            consumedBytes: nameConsumeResult.consumedBytes + attributesArrayConsumeResult.consumedBytes,
            remainingArray: attributesArrayConsumeResult.remainingArray,
            object: this
        };
    };
    _ElementRecord.prototype.consumeNBFXArray = function (arr) {
        return this.processNBFXArray(arr);
    };
    _ElementRecord.prototype.toNBFXArray = function () {
        var nameBytes = this.getName().toNBFXArray();
        var attributeBytesArray = this.getAttributes().map(function (a) { return a.toNBFXArray(); });
        var totalAttributesByteLength = 0;
        attributeBytesArray.forEach(function (v) {
            totalAttributesByteLength += v.byteLength;
        });
        var totalOutArrayByteLength = nameBytes.byteLength + totalAttributesByteLength;
        // Out array is generated by concat'ing all attributes in 
        var out = new Uint8Array(totalOutArrayByteLength);
        var offset = 0;
        out.set(nameBytes, 0);
        offset += nameBytes.byteLength;
        var attributeIndex = 0;
        var attributeBytes;
        while (offset < totalOutArrayByteLength) {
            attributeBytes = attributeBytesArray[attributeIndex++];
            out.set(attributeBytes, offset);
            offset += attributeBytes.byteLength;
        }
        return out;
    };
    _ElementRecord.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    return _ElementRecord;
})(_NBFXRecord);
/// <reference path="../!ref.ts" />
var _ElementRecordWithPrefix = (function (_super) {
    __extends(_ElementRecordWithPrefix, _super);
    function _ElementRecordWithPrefix(recordType, recordTypeString, includesPrefixInNBFXArray) {
        if (includesPrefixInNBFXArray === void 0) { includesPrefixInNBFXArray = true; }
        _super.call(this, recordType, recordTypeString);
        this._includesPrefixInNBFXArray = includesPrefixInNBFXArray;
    }
    _ElementRecordWithPrefix.prototype.getTagName = function () {
        return this.getPrefix().toNBFXString() + ":" + _super.prototype.getTagName.call(this);
    };
    _ElementRecordWithPrefix.prototype.getPrefix = function () {
        return this._prefix;
    };
    _ElementRecordWithPrefix.prototype.savePrefix = function (prefix) {
        if (prefix.toString() === "xmlns") {
            throw new Error("\"xmlns\" is not a valid name for prefixes");
        }
        if (typeof prefix === "undefined") {
            throw new Error("Invalid prefix");
        }
        if (prefix.toString().length === 0) {
            throw new Error("Length of prefix must be nonzero");
        }
        this._prefix = prefix;
        return this;
    };
    _ElementRecordWithPrefix.prototype.processNBFXArray = function (arr) {
        if (!(this.getName() === undefined) ||
            (this._includesPrefixInNBFXArray && !(this.getPrefix() === undefined))) {
            return null;
        }
        if (this._includesPrefixInNBFXArray) {
            var prefix = new _String();
            var prefixConsumeResult = prefix.consumeNBFXArray(arr);
            arr = prefixConsumeResult.remainingArray;
        }
        var nameConsumeResult = this.processNameFromNBFXArray(arr);
        arr = nameConsumeResult.remainingArray;
        var attributesArrayConsumeResult = _ElementRecord.ConsumeElementAttributesArrayFromNBFXArray(arr);
        if (this._includesPrefixInNBFXArray) {
            this.savePrefix(prefixConsumeResult.object);
        }
        this.saveName(nameConsumeResult.object);
        this.saveAttributes(attributesArrayConsumeResult.object);
        var totalConsumedBytes = 0;
        if (this._includesPrefixInNBFXArray) {
            totalConsumedBytes += prefixConsumeResult.consumedBytes;
        }
        totalConsumedBytes += (nameConsumeResult.consumedBytes + attributesArrayConsumeResult.consumedBytes);
        return {
            consumedBytes: totalConsumedBytes,
            remainingArray: attributesArrayConsumeResult.remainingArray,
            object: this
        };
    };
    _ElementRecordWithPrefix.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        var out = "<" + this.getPrefix().toNBFXString() + ":" + this.getName().toNBFXString();
        this.getAttributes().forEach(function (a) {
            out += a.toNBFXString(escapeXML);
        });
        return out + ">";
    };
    _ElementRecordWithPrefix.prototype.toNBFXArray = function () {
        var prefixBytes = this.getPrefix().toNBFXArray();
        var nameBytes = this.getName().toNBFXArray();
        var attributeBytesArray = this.getAttributes().map(function (a) { return a.toNBFXArray(); });
        var totalAttributesByteLength = 0;
        attributeBytesArray.forEach(function (v) {
            totalAttributesByteLength += v.byteLength;
        });
        var totalOutArrayByteLength = 0;
        if (this._includesPrefixInNBFXArray) {
            totalOutArrayByteLength += prefixBytes.byteLength;
        }
        totalOutArrayByteLength += (nameBytes.byteLength + totalAttributesByteLength);
        // Out array is generated by concat'ing all attributes in 
        var out = new Uint8Array(totalOutArrayByteLength);
        var offset = 0;
        if (this._includesPrefixInNBFXArray) {
            out.set(prefixBytes, offset);
            offset += prefixBytes.byteLength;
        }
        out.set(nameBytes, offset);
        offset += nameBytes.byteLength;
        var attributeIndex = 0;
        var attributeBytes;
        while (offset < totalOutArrayByteLength) {
            attributeBytes = attributeBytesArray[attributeIndex++];
            out.set(attributeBytes, offset);
            offset += attributeBytes.byteLength;
        }
        return out;
    };
    return _ElementRecordWithPrefix;
})(_ElementRecord);
/// <reference path="_NBFXRecord.ts" />
/// <reference path="_BaseRecordType.ts" />
/// <reference path="_TextRecord.ts" />
/// <reference path="_EmptyDataText.ts" />
/// <reference path="_FixedLengthHeaderText.ts" />
/// <reference path="_BytesNNText.ts" />
/// <reference path="_CharsNNText.ts" />
/// <reference path="_UnicodeCharsNNText.ts" />
/// <reference path="_FixedLengthText.ts" />
/// <reference path="_UuidText.ts" />
/// <reference path="_AttributeRecord.ts" />
/// <reference path="_AttributeRecordWithName.ts" />
/// <reference path="_AttributeRecordWithPrefixName.ts" />
/// <reference path="_AttributeRecordXmlnsWithPrefix.ts" />
/// <reference path="_ElementRecord.ts" />
/// <reference path="_ElementRecordWithPrefix.ts" /> 
/// <reference path="../!ref.ts" />
var _MultiByteInt31 = (function (_super) {
    __extends(_MultiByteInt31, _super);
    function _MultiByteInt31(value) {
        _super.call(this);
        if (typeof value === "number") {
            this._value = value;
        }
    }
    _MultiByteInt31.ArrayToValue = function (arr) {
        var numberOfBytes = _MultiByteInt31.DetectNumberOfBytes(arr);
        var value = 0;
        for (var i = numberOfBytes - 1; i >= 0; --i) {
            var block = arr[i];
            // Strip leading bit
            block &= 0x7F;
            // Append
            value |= block;
            // Shift
            if (i != 0) {
                value <<= 7;
            }
        }
        return value;
    };
    _MultiByteInt31.DetectNumberOfBytes = function (arr) {
        var numOfBytes = 0;
        if (arr.length > 5) {
            throw new Error("Array too long for MultiByteInt31");
        }
        for (var i = 0; i < arr.length; ++i) {
            ++numOfBytes;
            if (!(arr[i] & 0x80)) {
                break;
            }
        }
        return numOfBytes;
    };
    _MultiByteInt31.prototype.numberOfBytes = function () {
        var v = this._value;
        var bytes = 1;
        if (v <= 0x7F) {
            return bytes;
        }
        ;
        ++bytes;
        if (v <= 0x3FFF) {
            return bytes;
        }
        ;
        ++bytes;
        if (v <= 0x1FFFFF) {
            return bytes;
        }
        ;
        ++bytes;
        if (v <= 0x0FFFFFFF) {
            return bytes;
        }
        ;
        ++bytes;
        if (v <= 0x007FFFFFFF) {
            return bytes;
        }
        ;
        return null;
    };
    _MultiByteInt31.prototype.processNBFXArray = function (arr) {
        var searchBytesLength = Math.min(arr.byteLength, 5);
        var validBytesLength = _MultiByteInt31.DetectNumberOfBytes($Uint8ArrayUtil.Extract(arr, searchBytesLength));
        var consumedArrayBytes = $Uint8ArrayUtil.Extract(arr, validBytesLength);
        var remainingBytesArray = $Uint8ArrayUtil.Advance(arr, validBytesLength);
        this._value = _MultiByteInt31.ArrayToValue(consumedArrayBytes);
        return {
            consumedBytes: consumedArrayBytes.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        };
    };
    _MultiByteInt31.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return this._value.toString(radix);
    };
    _MultiByteInt31.prototype.consumeNBFXArray = function (arr) {
        if (!(this._value === undefined)) {
            return null;
        }
        return this.processNBFXArray(arr);
    };
    _MultiByteInt31.prototype.toNBFXArray = function () {
        var byteLength = this.numberOfBytes();
        var outArray = new Uint8Array(byteLength);
        var v = this._value;
        // Little-endian
        for (var i = 0; i < byteLength; ++i) {
            // Insert 7 bit segment with first bit set
            var block = (v & 0x7F) | 0x80;
            // Only preserve MSB 3 bits on highest block of 5
            // (Shouldn't be necessary, but just in case.)
            if (i >= 4) {
                block &= 0x07;
            }
            outArray[i] = block;
            // Shift
            v >>>= 7;
        }
        // Unset first bit on MSB block
        outArray[byteLength - 1] &= 0x7F;
        return outArray;
    };
    _MultiByteInt31.prototype.toNative = function () {
        return this._value;
    };
    return _MultiByteInt31;
})(_BaseRecordType);
/// <reference path="../!ref.ts" />
var _String = (function (_super) {
    __extends(_String, _super);
    function _String(value) {
        _super.call(this);
        if (typeof value === "string") {
            this.uint8($UnicodeUtil.StringToUTF8Array(value));
        }
    }
    _String.prototype.processNBFXArray = function (arr) {
        // Length header block is MBI31
        var lengthHeader = new _MultiByteInt31();
        var mbi31ConsumeResult = lengthHeader.consumeNBFXArray(arr);
        var stringLength = lengthHeader.toNative();
        // Advance
        arr = mbi31ConsumeResult.remainingArray;
        var consumedArrayBytes = $Uint8ArrayUtil.Extract(arr, stringLength);
        var remainingBytesArray = $Uint8ArrayUtil.Advance(arr, stringLength);
        this.uint8(consumedArrayBytes);
        return {
            consumedBytes: mbi31ConsumeResult.consumedBytes + consumedArrayBytes.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        };
    };
    _String.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return $UnicodeUtil.UTF8ArrayToString(this.uint8());
    };
    _String.prototype.toNBFXArray = function () {
        var lengthHeader = new _MultiByteInt31(this.uint8Length());
        var lengthHeaderNBFXArray = lengthHeader.toNBFXArray();
        var out = new Uint8Array(lengthHeaderNBFXArray.byteLength + this.uint8Length());
        out.set(lengthHeaderNBFXArray, 0);
        out.set(this.uint8(), lengthHeaderNBFXArray.byteLength);
        return out;
    };
    _String.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    return _String;
})(_BaseRecordType);
/// <reference path="../!ref.ts" />
var _DictionaryString = (function (_super) {
    __extends(_DictionaryString, _super);
    function _DictionaryString(value) {
        _super.call(this);
        if (typeof value === "string") {
            this._mbi31 = new _MultiByteInt31(_DictionaryString.StringToValue(value));
        }
        else if (typeof value === "number") {
            // Run through once to pick up errors
            _DictionaryString.ValueToString(value);
            this._mbi31 = new _MultiByteInt31(value);
        }
        else if (value instanceof _MultiByteInt31) {
            // Run through once to pick up errors
            _DictionaryString.ValueToString(this._mbi31.toNative());
            this._mbi31 = value;
        }
    }
    _DictionaryString.ValueToString = function (value) {
        // Lookup is done on even indices only
        if (value % 2) {
            throw new Error("DictionaryString values can only be even");
        }
        var str = _DictionaryString._Dictionary[value / 2];
        if (str === undefined) {
            throw new Error("DictionaryString value not valid");
        }
        return str;
    };
    _DictionaryString.StringToValue = function (str) {
        var index = _DictionaryString._Dictionary.indexOf(str);
        if (index < 0) {
            throw new Error("DictionaryString value not found");
        }
        return index * 2;
    };
    _DictionaryString.prototype.processNBFXArray = function (arr) {
        var mbi31 = new _MultiByteInt31();
        var mbi31ConsumeResult = mbi31.consumeNBFXArray(arr);
        this._mbi31 = mbi31ConsumeResult.object;
        return {
            consumedBytes: mbi31ConsumeResult.consumedBytes,
            remainingArray: mbi31ConsumeResult.remainingArray,
            object: this
        };
    };
    _DictionaryString.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return _DictionaryString.ValueToString(this._mbi31.toNative());
    };
    _DictionaryString.prototype.consumeNBFXArray = function (arr) {
        if (!(this._mbi31 === undefined)) {
            return null;
        }
        return this.processNBFXArray(arr);
    };
    _DictionaryString.prototype.toNBFXArray = function () {
        return this._mbi31.toNBFXArray();
    };
    _DictionaryString.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    _DictionaryString._Dictionary = [
        "mustUnderstand",
        "Envelope",
        "http://www.w3.org/2003/05/soap-envelope",
        "http://www.w3.org/2005/08/addressing",
        "Header",
        "Action",
        "To",
        "Body",
        "Algorithm",
        "RelatesTo",
        "http://www.w3.org/2005/08/addressing/anonymous",
        "URI",
        "Reference",
        "MessageID",
        "Id",
        "Identifier",
        "http://schemas.xmlsoap.org/ws/2005/02/rm",
        "Transforms",
        "Transform",
        "DigestMethod",
        "DigestValue",
        "Address",
        "ReplyTo",
        "SequenceAcknowledgement",
        "AcknowledgementRange",
        "Upper",
        "Lower",
        "BufferRemaining",
        "http://schemas.microsoft.com/ws/2006/05/rm",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/SequenceAcknowledgement",
        "SecurityTokenReference",
        "Sequence",
        "MessageNumber",
        "http://www.w3.org/2000/09/xmldsig#",
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "KeyInfo",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd",
        "http://www.w3.org/2001/04/xmlenc#",
        "http://schemas.xmlsoap.org/ws/2005/02/sc",
        "DerivedKeyToken",
        "Nonce",
        "Signature",
        "SignedInfo",
        "CanonicalizationMethod",
        "SignatureMethod",
        "SignatureValue",
        "DataReference",
        "EncryptedData",
        "EncryptionMethod",
        "CipherData",
        "CipherValue",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd",
        "Security",
        "Timestamp",
        "Created",
        "Expires",
        "Length",
        "ReferenceList",
        "ValueType",
        "Type",
        "EncryptedHeader",
        "http://docs.oasis-open.org/wss/oasis-wss-wssecurity-secext-1.1.xsd",
        "RequestSecurityTokenResponseCollection",
        "http://schemas.xmlsoap.org/ws/2005/02/trust",
        "http://schemas.xmlsoap.org/ws/2005/02/trust#BinarySecret",
        "http://schemas.microsoft.com/ws/2006/02/transactions",
        "s",
        "Fault",
        "MustUnderstand",
        "role",
        "relay",
        "Code",
        "Reason",
        "Text",
        "Node",
        "Role",
        "Detail",
        "Value",
        "Subcode",
        "NotUnderstood",
        "qname",
        "",
        "From",
        "FaultTo",
        "EndpointReference",
        "PortType",
        "ServiceName",
        "PortName",
        "ReferenceProperties",
        "RelationshipType",
        "Reply",
        "a",
        "http://schemas.xmlsoap.org/ws/2006/02/addressingidentity",
        "Identity",
        "Spn",
        "Upn",
        "Rsa",
        "Dns",
        "X509v3Certificate",
        "http://www.w3.org/2005/08/addressing/fault",
        "ReferenceParameters",
        "IsReferenceParameter",
        "http://www.w3.org/2005/08/addressing/reply",
        "http://www.w3.org/2005/08/addressing/none",
        "Metadata",
        "http://schemas.xmlsoap.org/ws/2004/08/addressing",
        "http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous",
        "http://schemas.xmlsoap.org/ws/2004/08/addressing/fault",
        "http://schemas.xmlsoap.org/ws/2004/06/addressingex",
        "RedirectTo",
        "Via",
        "http://www.w3.org/2001/10/xml-exc-c14n#",
        "PrefixList",
        "InclusiveNamespaces",
        "ec",
        "SecurityContextToken",
        "Generation",
        "Label",
        "Offset",
        "Properties",
        "Cookie",
        "wsc",
        "http://schemas.xmlsoap.org/ws/2004/04/sc",
        "http://schemas.xmlsoap.org/ws/2004/04/security/sc/dk",
        "http://schemas.xmlsoap.org/ws/2004/04/security/sc/sct",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/RST/SCT",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/RSTR/SCT",
        "RenewNeeded",
        "BadContextToken",
        "c",
        "http://schemas.xmlsoap.org/ws/2005/02/sc/dk",
        "http://schemas.xmlsoap.org/ws/2005/02/sc/sct",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RST/SCT",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/SCT",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RST/SCT/Renew",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/SCT/Renew",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RST/SCT/Cancel",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/SCT/Cancel",
        "http://www.w3.org/2001/04/xmlenc#aes128-cbc",
        "http://www.w3.org/2001/04/xmlenc#kw-aes128",
        "http://www.w3.org/2001/04/xmlenc#aes192-cbc",
        "http://www.w3.org/2001/04/xmlenc#kw-aes192",
        "http://www.w3.org/2001/04/xmlenc#aes256-cbc",
        "http://www.w3.org/2001/04/xmlenc#kw-aes256",
        "http://www.w3.org/2001/04/xmlenc#des-cbc",
        "http://www.w3.org/2000/09/xmldsig#dsa-sha1",
        "http://www.w3.org/2001/10/xml-exc-c14n#WithComments",
        "http://www.w3.org/2000/09/xmldsig#hmac-sha1",
        "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256",
        "http://schemas.xmlsoap.org/ws/2005/02/sc/dk/p_sha1",
        "http://www.w3.org/2001/04/xmlenc#ripemd160",
        "http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p",
        "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
        "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        "http://www.w3.org/2001/04/xmlenc#rsa-1_5",
        "http://www.w3.org/2000/09/xmldsig#sha1",
        "http://www.w3.org/2001/04/xmlenc#sha256",
        "http://www.w3.org/2001/04/xmlenc#sha512",
        "http://www.w3.org/2001/04/xmlenc#tripledes-cbc",
        "http://www.w3.org/2001/04/xmlenc#kw-tripledes",
        "http://schemas.xmlsoap.org/2005/02/trust/tlsnego#TLS_Wrap",
        "http://schemas.xmlsoap.org/2005/02/trust/spnego#GSS_Wrap",
        "http://schemas.microsoft.com/ws/2006/05/security",
        "dnse",
        "o",
        "Password",
        "PasswordText",
        "Username",
        "UsernameToken",
        "BinarySecurityToken",
        "EncodingType",
        "KeyIdentifier",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#HexBinary",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Text",
        "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509SubjectKeyIdentifier",
        "http://docs.oasis-open.org/wss/oasis-wss-kerberos-token-profile-1.1#GSS_Kerberosv5_AP_REQ",
        "http://docs.oasis-open.org/wss/oasis-wss-kerberos-token-profile-1.1#GSS_Kerberosv5_AP_REQ1510",
        "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.0#SAMLAssertionID",
        "Assertion",
        "urn:oasis:names:tc:SAML:1.0:assertion",
        "http://docs.oasis-open.org/wss/oasis-wss-rel-token-profile-1.0.pdf#license",
        "FailedAuthentication",
        "InvalidSecurityToken",
        "InvalidSecurity",
        "k",
        "SignatureConfirmation",
        "TokenType",
        "http://docs.oasis-open.org/wss/oasis-wss-soap-message-security-1.1#ThumbprintSHA1",
        "http://docs.oasis-open.org/wss/oasis-wss-soap-message-security-1.1#EncryptedKey",
        "http://docs.oasis-open.org/wss/oasis-wss-soap-message-security-1.1#EncryptedKeySHA1",
        "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV1.1",
        "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0",
        "http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLID",
        "AUTH-HASH",
        "RequestSecurityTokenResponse",
        "KeySize",
        "RequestedTokenReference",
        "AppliesTo",
        "Authenticator",
        "CombinedHash",
        "BinaryExchange",
        "Lifetime",
        "RequestedSecurityToken",
        "Entropy",
        "RequestedProofToken",
        "ComputedKey",
        "RequestSecurityToken",
        "RequestType",
        "Context",
        "BinarySecret",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/spnego",
        " http://schemas.xmlsoap.org/ws/2005/02/trust/tlsnego",
        "wst",
        "http://schemas.xmlsoap.org/ws/2004/04/trust",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/RST/Issue",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/RSTR/Issue",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/Issue",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/CK/PSHA1",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/SymmetricKey",
        "http://schemas.xmlsoap.org/ws/2004/04/security/trust/Nonce",
        "KeyType",
        "http://schemas.xmlsoap.org/ws/2004/04/trust/SymmetricKey",
        "http://schemas.xmlsoap.org/ws/2004/04/trust/PublicKey",
        "Claims",
        "InvalidRequest",
        "RequestFailed",
        "SignWith",
        "EncryptWith",
        "EncryptionAlgorithm",
        "CanonicalizationAlgorithm",
        "ComputedKeyAlgorithm",
        "UseKey",
        "http://schemas.microsoft.com/net/2004/07/secext/WS-SPNego",
        "http://schemas.microsoft.com/net/2004/07/secext/TLSNego",
        "t",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/Issue",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/Issue",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/SymmetricKey",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/CK/PSHA1",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/Nonce",
        "RenewTarget",
        "CancelTarget",
        "RequestedTokenCancelled",
        "RequestedAttachedReference",
        "RequestedUnattachedReference",
        "IssuedTokens",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/Renew",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/Cancel",
        "http://schemas.xmlsoap.org/ws/2005/02/trust/PublicKey",
        "Access",
        "AccessDecision",
        "Advice",
        "AssertionID",
        "AssertionIDReference",
        "Attribute",
        "AttributeName",
        "AttributeNamespace",
        "AttributeStatement",
        "AttributeValue",
        "Audience",
        "AudienceRestrictionCondition",
        "AuthenticationInstant",
        "AuthenticationMethod",
        "AuthenticationStatement",
        "AuthorityBinding",
        "AuthorityKind",
        "AuthorizationDecisionStatement",
        "Binding",
        "Condition",
        "Conditions",
        "Decision",
        "DoNotCacheCondition",
        "Evidence",
        "IssueInstant",
        "Issuer",
        "Location",
        "MajorVersion",
        "MinorVersion",
        "NameIdentifier",
        "Format",
        "NameQualifier",
        "Namespace",
        "NotBefore",
        "NotOnOrAfter",
        "saml",
        "Statement",
        "Subject",
        "SubjectConfirmation",
        "SubjectConfirmationData",
        "ConfirmationMethod",
        "urn:oasis:names:tc:SAML:1.0:cm:holder-of-key",
        "urn:oasis:names:tc:SAML:1.0:cm:sender-vouches",
        "SubjectLocality",
        "DNSAddress",
        "IPAddress",
        "SubjectStatement",
        "urn:oasis:names:tc:SAML:1.0:am:unspecified",
        "xmlns",
        "Resource",
        "UserName",
        "urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName",
        "EmailName",
        "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "u",
        "ChannelInstance",
        "http://schemas.microsoft.com/ws/2005/02/duplex",
        "Encoding",
        "MimeType",
        "CarriedKeyName",
        "Recipient",
        "EncryptedKey",
        "KeyReference",
        "e",
        "http://www.w3.org/2001/04/xmlenc#Element",
        "http://www.w3.org/2001/04/xmlenc#Content",
        "KeyName",
        "MgmtData",
        "KeyValue",
        "RSAKeyValue",
        "Modulus",
        "Exponent",
        "X509Data",
        "X509IssuerSerial",
        "X509IssuerName",
        "X509SerialNumber",
        "X509Certificate",
        "AckRequested",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/AckRequested",
        "AcksTo",
        "Accept",
        "CreateSequence",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/CreateSequence",
        "CreateSequenceRefused",
        "CreateSequenceResponse",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/CreateSequenceResponse",
        "FaultCode",
        "InvalidAcknowledgement",
        "LastMessage",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/LastMessage",
        "LastMessageNumberExceeded",
        "MessageNumberRollover",
        "Nack",
        "netrm",
        "Offer",
        "r",
        "SequenceFault",
        "SequenceTerminated",
        "TerminateSequence",
        "http://schemas.xmlsoap.org/ws/2005/02/rm/TerminateSequence",
        "UnknownSequence",
        "http://schemas.microsoft.com/ws/2006/02/tx/oletx",
        "oletx",
        "OleTxTransaction",
        "PropagationToken",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor",
        "wscoor",
        "CreateCoordinationContext",
        "CreateCoordinationContextResponse",
        "CoordinationContext",
        "CurrentContext",
        "CoordinationType",
        "RegistrationService",
        "Register",
        "RegisterResponse",
        "ProtocolIdentifier",
        "CoordinatorProtocolService",
        "ParticipantProtocolService",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor/CreateCoordinationContext",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor/CreateCoordinationContextResponse",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor/Register",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor/RegisterResponse",
        "http://schemas.xmlsoap.org/ws/2004/10/wscoor/fault",
        "ActivationCoordinatorPortType",
        "RegistrationCoordinatorPortType",
        "InvalidState",
        "InvalidProtocol",
        "InvalidParameters",
        "NoActivity",
        "ContextRefused",
        "AlreadyRegistered",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat",
        "wsat",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Completion",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Durable2PC",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Volatile2PC",
        "Prepare",
        "Prepared",
        "ReadOnly",
        "Commit",
        "Rollback",
        "Committed",
        "Aborted",
        "Replay",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Commit",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Rollback",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Committed",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Aborted",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Prepare",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Prepared",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/ReadOnly",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/Replay",
        "http://schemas.xmlsoap.org/ws/2004/10/wsat/fault",
        "CompletionCoordinatorPortType",
        "CompletionParticipantPortType",
        "CoordinatorPortType",
        "ParticipantPortType",
        "InconsistentInternalState",
        "mstx",
        "Enlistment",
        "protocol",
        "LocalTransactionId",
        "IsolationLevel",
        "IsolationFlags",
        "Description",
        "Loopback",
        "RegisterInfo",
        "ContextId",
        "TokenId",
        "AccessDenied",
        "InvalidPolicy",
        "CoordinatorRegistrationFailed",
        "TooManyEnlistments",
        "Disabled",
        "ActivityId",
        "http://schemas.microsoft.com/2004/09/ServiceModel/Diagnostics",
        "http://docs.oasis-open.org/wss/oasis-wss-kerberos-token-profile-1.1#Kerberosv5APREQSHA1",
        "http://schemas.xmlsoap.org/ws/2002/12/policy",
        "FloodMessage",
        "LinkUtility",
        "Hops",
        "http://schemas.microsoft.com/net/2006/05/peer/HopCount",
        "PeerVia",
        "http://schemas.microsoft.com/net/2006/05/peer",
        "PeerFlooder",
        "PeerTo",
        "http://schemas.microsoft.com/ws/2005/05/routing",
        "PacketRoutable",
        "http://schemas.microsoft.com/ws/2005/05/addressing/none",
        "http://schemas.microsoft.com/ws/2005/05/envelope/none",
        "http://www.w3.org/2001/XMLSchema-instance",
        "http://www.w3.org/2001/XMLSchema",
        "nil",
        "type",
        "char",
        "boolean",
        "byte",
        "unsignedByte",
        "short",
        "unsignedShort",
        "int",
        "unsignedInt",
        "long",
        "unsignedLong",
        "float",
        "double",
        "decimal",
        "dateTime",
        "string",
        "base64Binary",
        "anyType",
        "duration",
        "guid",
        "anyURI",
        "QName",
        "time",
        "date",
        "hexBinary",
        "gYearMonth",
        "gYear",
        "gMonthDay",
        "gDay",
        "gMonth",
        "integer",
        "positiveInteger",
        "negativeInteger",
        "nonPositiveInteger",
        "nonNegativeInteger",
        "normalizedString",
        "ConnectionLimitReached",
        "http://schemas.xmlsoap.org/soap/envelope/",
        "actor",
        "faultcode",
        "faultstring",
        "faultactor",
        "detail"
    ];
    return _DictionaryString;
})(_BaseRecordType);
/// <reference path="_MultiByteInt31.ts" />
/// <reference path="_String.ts" />
/// <reference path="_DictionaryString.ts" /> 
/// <reference path="../!ref.ts" />
var ZeroText = (function (_super) {
    __extends(ZeroText, _super);
    function ZeroText() {
        _super.call(this, ZeroText._RecordType, ZeroText._RecordTypeString);
    }
    ZeroText.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return "0" +
            this.getAttachedElementRecordEndTag();
    };
    ZeroText.prototype.toNative = function () {
        return 0;
    };
    ZeroText.prototype.getTextContent = function (escapeXML) {
        return "0";
    };
    ZeroText._RecordType = 0x80;
    ZeroText._RecordTypeString = "ZeroText";
    return ZeroText;
})(_EmptyDataText);
/// <reference path="../!ref.ts" />
var OneText = (function (_super) {
    __extends(OneText, _super);
    function OneText() {
        _super.call(this, OneText._RecordType, OneText._RecordTypeString);
    }
    OneText.prototype.toNative = function () {
        return 1;
    };
    OneText.prototype.getTextContent = function (escapeXML) {
        return "1";
    };
    OneText._RecordType = 0x82;
    OneText._RecordTypeString = "OneText";
    return OneText;
})(_EmptyDataText);
/// <reference path="../!ref.ts" />
var FalseText = (function (_super) {
    __extends(FalseText, _super);
    function FalseText() {
        _super.call(this, FalseText._RecordType, FalseText._RecordTypeString);
    }
    FalseText.prototype.toNative = function () {
        return false;
    };
    FalseText.prototype.getTextContent = function (escapeXML) {
        return "false";
    };
    FalseText._RecordType = 0x84;
    FalseText._RecordTypeString = "FalseText";
    return FalseText;
})(_EmptyDataText);
/// <reference path="../!ref.ts" />
var TrueText = (function (_super) {
    __extends(TrueText, _super);
    function TrueText() {
        _super.call(this, TrueText._RecordType, TrueText._RecordTypeString);
    }
    TrueText.prototype.toNative = function () {
        return true;
    };
    TrueText.prototype.getTextContent = function (escapeXML) {
        return "true";
    };
    TrueText._RecordType = 0x86;
    TrueText._RecordTypeString = "TrueText";
    return TrueText;
})(_EmptyDataText);
/// <reference path="../!ref.ts" />
var Int8Text = (function (_super) {
    __extends(Int8Text, _super);
    function Int8Text(num) {
        _super.call(this, Int8Text._RecordType, Int8Text._RecordTypeString, Int8Text._Length);
        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int8Text._Length));
            this.uint8DataView().setInt8(0, num);
        }
    }
    Int8Text.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    };
    Int8Text.prototype.toNative = function () {
        return this.uint8DataView().getInt8(0);
    };
    Int8Text.prototype.getTextContent = function (escapeXML) {
        return this.toNative().toString(10);
    };
    Int8Text._RecordType = 0x88;
    Int8Text._RecordTypeString = "Int8Text";
    Int8Text._Length = 1;
    return Int8Text;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var Int16Text = (function (_super) {
    __extends(Int16Text, _super);
    function Int16Text(num) {
        _super.call(this, Int16Text._RecordType, Int16Text._RecordTypeString, Int16Text._Length);
        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int16Text._Length));
            this.uint8DataView().setInt16(0, num, true);
        }
    }
    Int16Text.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    };
    Int16Text.prototype.toNative = function () {
        return this.uint8DataView().getInt16(0, true);
    };
    Int16Text.prototype.getTextContent = function (escapeXML) {
        return this.toNative().toString(10);
    };
    Int16Text._RecordType = 0x8A;
    Int16Text._RecordTypeString = "Int16Text";
    Int16Text._Length = 2;
    return Int16Text;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var Int32Text = (function (_super) {
    __extends(Int32Text, _super);
    function Int32Text(num) {
        _super.call(this, Int32Text._RecordType, Int32Text._RecordTypeString, Int32Text._Length);
        if (typeof num === "number") {
            this.uint8(new Uint8Array(Int32Text._Length));
            this.uint8DataView().setInt32(0, num, true);
        }
    }
    Int32Text.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return this.toNative().toString(radix) +
            this.getAttachedElementRecordEndTag();
    };
    Int32Text.prototype.toNative = function () {
        return this.uint8DataView().getInt32(0, true);
    };
    Int32Text.prototype.getTextContent = function (escapeXML) {
        return this.toNative().toString(10);
    };
    Int32Text._RecordType = 0x8C;
    Int32Text._RecordTypeString = "Int32Text";
    Int32Text._Length = 4;
    return Int32Text;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var FloatText = (function (_super) {
    __extends(FloatText, _super);
    function FloatText(num) {
        _super.call(this, FloatText._RecordType, FloatText._RecordTypeString, FloatText._Length);
        if (typeof num === "number") {
            this.uint8(new Uint8Array(FloatText._Length));
            this.uint8DataView().setFloat32(0, num, true);
        }
    }
    FloatText.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return $NumberUtil.ToNBFXString(this.toNative(), radix) +
            this.getAttachedElementRecordEndTag();
    };
    FloatText.prototype.toNative = function () {
        return this.uint8DataView().getFloat32(0, true);
    };
    FloatText.prototype.getTextContent = function (escapeXML) {
        return $NumberUtil.ToNBFXString(this.toNative(), 10);
    };
    FloatText._RecordType = 0x90;
    FloatText._RecordTypeString = "FloatText";
    FloatText._Length = 4;
    return FloatText;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var DoubleText = (function (_super) {
    __extends(DoubleText, _super);
    function DoubleText(num) {
        _super.call(this, DoubleText._RecordType, DoubleText._RecordTypeString, DoubleText._Length);
        if (typeof num === "number") {
            this.uint8(new Uint8Array(DoubleText._Length));
            this.uint8DataView().setFloat64(0, num, true);
        }
    }
    DoubleText.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return $NumberUtil.ToNBFXString(this.toNative(), radix) +
            this.getAttachedElementRecordEndTag();
    };
    DoubleText.prototype.toNative = function () {
        return this.uint8DataView().getFloat64(0, true);
    };
    DoubleText.prototype.getTextContent = function (escapeXML) {
        return $NumberUtil.ToNBFXString(this.toNative(), 10);
    };
    DoubleText._RecordType = 0x92;
    DoubleText._RecordTypeString = "DoubleText";
    DoubleText._Length = 8;
    return DoubleText;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var Chars8Text = (function (_super) {
    __extends(Chars8Text, _super);
    function Chars8Text(str) {
        _super.call(this, Chars8Text._RecordType, Chars8Text._RecordTypeString, Chars8Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFF);
        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
    Chars8Text._RecordType = 0x98;
    Chars8Text._RecordTypeString = "Chars8Text";
    Chars8Text._LengthHeaderBytes = 1;
    return Chars8Text;
})(_CharsNNText);
/// <reference path="../!ref.ts" />
var Chars16Text = (function (_super) {
    __extends(Chars16Text, _super);
    function Chars16Text(str) {
        _super.call(this, Chars16Text._RecordType, Chars16Text._RecordTypeString, Chars16Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFFFF);
        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
    Chars16Text._RecordType = 0x9A;
    Chars16Text._RecordTypeString = "Chars16Text";
    Chars16Text._LengthHeaderBytes = 2;
    return Chars16Text;
})(_CharsNNText);
/// <reference path="../!ref.ts" />
var Chars32Text = (function (_super) {
    __extends(Chars32Text, _super);
    function Chars32Text(str) {
        _super.call(this, Chars32Text._RecordType, Chars32Text._RecordTypeString, Chars32Text._LengthHeaderBytes);
        this.uint8MaxLength(0x7FFFFFFF);
        if (typeof str === "string") {
            this.saveUTF8(str);
        }
    }
    Chars32Text._RecordType = 0x9C;
    Chars32Text._RecordTypeString = "Chars32Text";
    Chars32Text._LengthHeaderBytes = 4;
    return Chars32Text;
})(_CharsNNText);
/// <reference path="../!ref.ts" />
var Bytes8Text = (function (_super) {
    __extends(Bytes8Text, _super);
    function Bytes8Text(b64) {
        _super.call(this, Bytes8Text._RecordType, Bytes8Text._RecordTypeString, Bytes8Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFF);
        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
    Bytes8Text._RecordType = 0x9E;
    Bytes8Text._RecordTypeString = "Bytes8Text";
    Bytes8Text._LengthHeaderBytes = 1;
    return Bytes8Text;
})(_BytesNNText);
/// <reference path="../!ref.ts" />
var Bytes16Text = (function (_super) {
    __extends(Bytes16Text, _super);
    function Bytes16Text(b64) {
        _super.call(this, Bytes16Text._RecordType, Bytes16Text._RecordTypeString, Bytes16Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFFFF);
        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
    Bytes16Text._RecordType = 0xA0;
    Bytes16Text._RecordTypeString = "Bytes16Text";
    Bytes16Text._LengthHeaderBytes = 2;
    return Bytes16Text;
})(_BytesNNText);
/// <reference path="../!ref.ts" />
var Bytes32Text = (function (_super) {
    __extends(Bytes32Text, _super);
    function Bytes32Text(b64) {
        _super.call(this, Bytes32Text._RecordType, Bytes32Text._RecordTypeString, Bytes32Text._LengthHeaderBytes);
        this.uint8MaxLength(0x7FFFFFFF);
        if (typeof b64 === "string") {
            this.saveBase64(b64);
        }
    }
    Bytes32Text._RecordType = 0xA2;
    Bytes32Text._RecordTypeString = "Bytes32Text";
    Bytes32Text._LengthHeaderBytes = 4;
    return Bytes32Text;
})(_BytesNNText);
/// <reference path="../!ref.ts" />
var EmptyText = (function (_super) {
    __extends(EmptyText, _super);
    function EmptyText() {
        _super.call(this, EmptyText._RecordType, EmptyText._RecordTypeString);
    }
    EmptyText.prototype.toNative = function () {
        return "";
    };
    EmptyText.prototype.getTextContent = function (escapeXML) {
        return "";
    };
    EmptyText._RecordType = 0xA8;
    EmptyText._RecordTypeString = "EmptyText";
    return EmptyText;
})(_EmptyDataText);
/// <reference path="../!ref.ts" />
var DictionaryText = (function (_super) {
    __extends(DictionaryText, _super);
    function DictionaryText(value) {
        _super.call(this, DictionaryText._RecordType, DictionaryText._RecordTypeString);
        if (typeof value === "string" || typeof value === "number") {
            this._dictString = new _DictionaryString(value);
        }
        else if (value instanceof _DictionaryString) {
            this._dictString = value;
        }
    }
    DictionaryText.prototype.processNBFXArray = function (arr) {
        var dictString = new _DictionaryString();
        var dictStringConsumeResult = dictString.consumeNBFXArray(arr);
        this._dictString = dictStringConsumeResult.object;
        return {
            consumedBytes: dictStringConsumeResult.consumedBytes,
            remainingArray: dictStringConsumeResult.remainingArray,
            object: this
        };
    };
    DictionaryText.prototype.toNBFXArray = function () {
        return this._dictString.toNBFXArray();
    };
    DictionaryText.prototype.toNative = function () {
        return this._dictString.toNative();
    };
    DictionaryText.prototype.getTextContent = function (escapeXML) {
        return this._dictString.toNBFXString();
    };
    DictionaryText._RecordType = 0xAA;
    DictionaryText._RecordTypeString = "DictionaryText";
    return DictionaryText;
})(_TextRecord);
/// <reference path="../!ref.ts" />
var UniqueIdText = (function (_super) {
    __extends(UniqueIdText, _super);
    function UniqueIdText(arr) {
        _super.call(this, UniqueIdText._RecordType, UniqueIdText._RecordTypeString);
        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
    UniqueIdText.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return _super.prototype.generateNBFXStringRepresentation.call(this);
    };
    UniqueIdText.prototype.getTextContent = function (escapeXML) {
        return "urn:uuid:" + _super.prototype.getTextContent.call(this, escapeXML);
    };
    UniqueIdText._RecordType = 0xAC;
    UniqueIdText._RecordTypeString = "UniqueIdText";
    return UniqueIdText;
})(_UuidText);
/// <reference path="../!ref.ts" />
var UuidText = (function (_super) {
    __extends(UuidText, _super);
    function UuidText(arr) {
        _super.call(this, UuidText._RecordType, UuidText._RecordTypeString);
        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
    UuidText._RecordType = 0xB0;
    UuidText._RecordTypeString = "UuidText";
    return UuidText;
})(_UuidText);
/// <reference path="../!ref.ts" />
var BoolText = (function (_super) {
    __extends(BoolText, _super);
    function BoolText(value) {
        _super.call(this, BoolText._RecordType, BoolText._RecordTypeString, BoolText._Length);
        if (typeof value === "boolean") {
            this.saveBooleanAsNumber(value);
        }
        else if (typeof value === "number") {
            this.saveBooleanAsNumber(!!(value));
        }
    }
    BoolText.prototype.saveBooleanAsNumber = function (b) {
        this.uint8(new Uint8Array(BoolText._Length));
        if (b) {
            this.uint8DataView().setUint8(0, 0x01);
        }
        else {
            this.uint8DataView().setUint8(0, 0x00);
        }
        return this;
    };
    BoolText.prototype.toNative = function () {
        return ((this.uint8()[0]) ? true : false);
    };
    BoolText.prototype.getTextContent = function (escapeXML) {
        return this.toNative().toString();
    };
    BoolText._RecordType = 0xB4;
    BoolText._RecordTypeString = "BoolText";
    BoolText._Length = 1;
    return BoolText;
})(_FixedLengthText);
/// <reference path="../!ref.ts" />
var UnicodeChars8Text = (function (_super) {
    __extends(UnicodeChars8Text, _super);
    function UnicodeChars8Text(str) {
        _super.call(this, UnicodeChars8Text._RecordType, UnicodeChars8Text._RecordTypeString, UnicodeChars8Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFF);
        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
    UnicodeChars8Text._RecordType = 0xB6;
    UnicodeChars8Text._RecordTypeString = "UnicodeChars8Text";
    UnicodeChars8Text._LengthHeaderBytes = 1;
    return UnicodeChars8Text;
})(_UnicodeCharsNNText);
/// <reference path="../!ref.ts" />
var UnicodeChars16Text = (function (_super) {
    __extends(UnicodeChars16Text, _super);
    function UnicodeChars16Text(str) {
        _super.call(this, UnicodeChars16Text._RecordType, UnicodeChars16Text._RecordTypeString, UnicodeChars16Text._LengthHeaderBytes);
        this.uint8MaxLength(0xFFFF);
        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
    UnicodeChars16Text._RecordType = 0xB8;
    UnicodeChars16Text._RecordTypeString = "UnicodeChars16Text";
    UnicodeChars16Text._LengthHeaderBytes = 2;
    return UnicodeChars16Text;
})(_UnicodeCharsNNText);
/// <reference path="../!ref.ts" />
var UnicodeChars32Text = (function (_super) {
    __extends(UnicodeChars32Text, _super);
    function UnicodeChars32Text(str) {
        _super.call(this, UnicodeChars32Text._RecordType, UnicodeChars32Text._RecordTypeString);
        if (typeof str === "string") {
            this.saveUTF16(str);
        }
    }
    UnicodeChars32Text.prototype.saveUTF16 = function (str) {
        this.uint8($UnicodeUtil.StringToUTF16Array(str, true));
        return this;
    };
    UnicodeChars32Text.prototype.processNBFXArray = function (arr) {
        // Length header block is MBI31
        var lengthHeader = new _MultiByteInt31();
        var mbi31ConsumeResult = lengthHeader.consumeNBFXArray(arr);
        var contentLength = lengthHeader.toNative();
        // Advance
        arr = mbi31ConsumeResult.remainingArray;
        var consumedArrayBytes = $Uint8ArrayUtil.Extract(arr, contentLength);
        var remainingBytesArray = $Uint8ArrayUtil.Advance(arr, contentLength);
        this.uint8(consumedArrayBytes);
        return {
            consumedBytes: mbi31ConsumeResult.consumedBytes + consumedArrayBytes.byteLength,
            remainingArray: remainingBytesArray,
            object: this
        };
    };
    UnicodeChars32Text.prototype.toNBFXArray = function () {
        var lengthBytesArray = new _MultiByteInt31(this.uint8Length()).toNBFXArray();
        var out = new Uint8Array(lengthBytesArray.byteLength + this.uint8Length());
        out.set(lengthBytesArray, 0);
        out.set(this.uint8(), lengthBytesArray.byteLength);
        return out;
    };
    UnicodeChars32Text.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    UnicodeChars32Text.prototype.getTextContent = function (escapeXML) {
        var out = $UnicodeUtil.UTF16ArrayToString(this.uint8(), true);
        if (escapeXML) {
            out = $XmlEntityUtil.Escape(out);
        }
        return out;
    };
    UnicodeChars32Text._RecordType = 0xBA;
    UnicodeChars32Text._RecordTypeString = "UnicodeChars32Text";
    return UnicodeChars32Text;
})(_TextRecord);
/// <reference path="../!ref.ts" />
var QNameDictionaryText = (function (_super) {
    __extends(QNameDictionaryText, _super);
    function QNameDictionaryText(arr) {
        _super.call(this, QNameDictionaryText._RecordType, QNameDictionaryText._RecordTypeString, QNameDictionaryText._Length);
        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
    QNameDictionaryText.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    QNameDictionaryText.prototype.getTextContent = function (escapeXML) {
        var dataView = this.uint8DataView();
        var prefix = dataView.getUint8(0);
        var name = new _DictionaryString();
        name.consumeNBFXArray(new Uint8Array(this.uint8().buffer, 1, 3));
        return $PrefixSingleCharUtil.ValueToChar(prefix) + ":" + name.toNBFXString();
    };
    QNameDictionaryText._RecordType = 0xBC;
    QNameDictionaryText._RecordTypeString = "QNameDictionaryText";
    QNameDictionaryText._Length = 4;
    return QNameDictionaryText;
})(_FixedLengthText);
/// <reference path="ZeroText.ts" />
/// <reference path="OneText.ts" />
/// <reference path="FalseText.ts" />
/// <reference path="TrueText.ts" />
/// <reference path="Int8Text.ts" />
/// <reference path="Int16Text.ts" />
/// <reference path="Int32Text.ts" />
/// <reference path="FloatText.ts" />
/// <reference path="DoubleText.ts" />
/// <reference path="Chars8Text.ts" />
/// <reference path="Chars16Text.ts" />
/// <reference path="Chars32Text.ts" />
/// <reference path="Bytes8Text.ts" />
/// <reference path="Bytes16Text.ts" />
/// <reference path="Bytes32Text.ts" />
/// <reference path="EmptyText.ts" />
/// <reference path="DictionaryText.ts" />
/// <reference path="UniqueIdText.ts" />
/// <reference path="UuidText.ts" />
/// <reference path="BoolText.ts" />
/// <reference path="UnicodeChars8Text.ts" />
/// <reference path="UnicodeChars16Text.ts" />
/// <reference path="UnicodeChars32Text.ts" />
/// <reference path="QNameDictionaryText.ts" /> 
/// <reference path="../!ref.ts" />
var ShortAttribute = (function (_super) {
    __extends(ShortAttribute, _super);
    function ShortAttribute(name, value) {
        _super.call(this, ShortAttribute._RecordType, ShortAttribute._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveValue(value);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
    ShortAttribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    ShortAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    ShortAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    ShortAttribute.prototype.getAttributeName = function () {
        return this.getName().toNBFXString();
    };
    ShortAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    ShortAttribute._RecordType = 0x04;
    ShortAttribute._RecordTypeString = "ShortAttribute";
    return ShortAttribute;
})(_AttributeRecordWithName);
/// <reference path="../!ref.ts" />
var Attribute = (function (_super) {
    __extends(Attribute, _super);
    function Attribute(prefix, name, value) {
        _super.call(this, Attribute._RecordType, Attribute._RecordTypeString);
        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix))
                .saveNameValue(name, value);
        }
        else if (prefix instanceof _String) {
            this.savePrefix(prefix)
                .saveNameValue(name, value);
        }
    }
    Attribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    Attribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    Attribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    Attribute.prototype.saveNameValue = function (name, value) {
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveValue(value);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveValue(value);
        }
    };
    Attribute.prototype.getAttributeName = function () {
        return this.getPrefix().toNBFXString() + ":" + this.getName().toNBFXString();
    };
    Attribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    Attribute._RecordType = 0x05;
    Attribute._RecordTypeString = "Attribute";
    return Attribute;
})(_AttributeRecordWithPrefixName);
/// <reference path="../!ref.ts" />
var ShortDictionaryAttribute = (function (_super) {
    __extends(ShortDictionaryAttribute, _super);
    function ShortDictionaryAttribute(name, value) {
        _super.call(this, ShortDictionaryAttribute._RecordType, ShortDictionaryAttribute._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveValue(value);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
    ShortDictionaryAttribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    ShortDictionaryAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    ShortDictionaryAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    ShortDictionaryAttribute.prototype.getAttributeName = function () {
        return this.getName().toNBFXString();
    };
    ShortDictionaryAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    ShortDictionaryAttribute._RecordType = 0x06;
    ShortDictionaryAttribute._RecordTypeString = "ShortDictionaryAttribute";
    return ShortDictionaryAttribute;
})(_AttributeRecordWithName);
/// <reference path="../!ref.ts" />
var DictionaryAttribute = (function (_super) {
    __extends(DictionaryAttribute, _super);
    function DictionaryAttribute(prefix, name, value) {
        _super.call(this, DictionaryAttribute._RecordType, DictionaryAttribute._RecordTypeString);
        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix))
                .saveNameValue(name, value);
        }
        else if (prefix instanceof _String) {
            this.savePrefix(prefix)
                .saveNameValue(name, value);
        }
    }
    DictionaryAttribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    DictionaryAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    DictionaryAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    DictionaryAttribute.prototype.saveNameValue = function (name, value) {
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveValue(value);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveValue(value);
        }
    };
    DictionaryAttribute.prototype.getAttributeName = function () {
        return this.getPrefix().toNBFXString() + ":" + this.getName().toNBFXString();
    };
    DictionaryAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    DictionaryAttribute._RecordType = 0x07;
    DictionaryAttribute._RecordTypeString = "DictionaryAttribute";
    return DictionaryAttribute;
})(_AttributeRecordWithPrefixName);
/// <reference path="../!ref.ts" />
var ShortXmlnsAttribute = (function (_super) {
    __extends(ShortXmlnsAttribute, _super);
    function ShortXmlnsAttribute(value) {
        _super.call(this, ShortXmlnsAttribute._RecordType, ShortXmlnsAttribute._RecordTypeString);
        if (typeof value === "string") {
            this.saveValue(new _String(value));
        }
        else if (value instanceof _String) {
            this.saveValue(value);
        }
    }
    ShortXmlnsAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var value = new _String();
        var valueConsumeResult = value.consumeNBFXArray(arr);
        return valueConsumeResult;
    };
    ShortXmlnsAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    ShortXmlnsAttribute.prototype.getAttributeName = function () {
        return "xmlns";
    };
    ShortXmlnsAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    ShortXmlnsAttribute._RecordType = 0x08;
    ShortXmlnsAttribute._RecordTypeString = "ShortXmlnsAttribute";
    return ShortXmlnsAttribute;
})(_AttributeRecord);
/// <reference path="../!ref.ts" />
var XmlnsAttribute = (function (_super) {
    __extends(XmlnsAttribute, _super);
    function XmlnsAttribute(prefix, value) {
        _super.call(this, XmlnsAttribute._RecordType, XmlnsAttribute._RecordTypeString);
        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix));
            this.saveValue(value);
        }
        else if (prefix instanceof _String) {
            this.savePrefix(prefix);
            this.saveValue(value);
        }
    }
    XmlnsAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var value = new _String();
        return value.consumeNBFXArray(arr);
    };
    XmlnsAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    XmlnsAttribute.prototype.getAttributeName = function () {
        return "xmlns:" + this.getPrefix().toNBFXString();
    };
    XmlnsAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    XmlnsAttribute._RecordType = 0x09;
    XmlnsAttribute._RecordTypeString = "XmlnsAttribute";
    return XmlnsAttribute;
})(_AttributeRecordXmlnsWithPrefix);
/// <reference path="../!ref.ts" />
var ShortDictionaryXmlnsAttribute = (function (_super) {
    __extends(ShortDictionaryXmlnsAttribute, _super);
    function ShortDictionaryXmlnsAttribute(value) {
        _super.call(this, ShortDictionaryXmlnsAttribute._RecordType, ShortDictionaryXmlnsAttribute._RecordTypeString);
        if (typeof value === "string") {
            this.saveValue(new _DictionaryString(value));
        }
        else if (value instanceof _DictionaryString) {
            this.saveValue(value);
        }
    }
    ShortDictionaryXmlnsAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var value = new _DictionaryString();
        var valueConsumeResult = value.consumeNBFXArray(arr);
        return valueConsumeResult;
    };
    ShortDictionaryXmlnsAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    ShortDictionaryXmlnsAttribute.prototype.getAttributeName = function () {
        return "xmlns";
    };
    ShortDictionaryXmlnsAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    ShortDictionaryXmlnsAttribute._RecordType = 0x0A;
    ShortDictionaryXmlnsAttribute._RecordTypeString = "ShortDictionaryXmlnsAttribute";
    return ShortDictionaryXmlnsAttribute;
})(_AttributeRecord);
/// <reference path="../!ref.ts" />
var DictionaryXmlnsAttribute = (function (_super) {
    __extends(DictionaryXmlnsAttribute, _super);
    function DictionaryXmlnsAttribute(prefix, value) {
        _super.call(this, DictionaryXmlnsAttribute._RecordType, DictionaryXmlnsAttribute._RecordTypeString);
        if (typeof prefix === "string") {
            this.savePrefix(new _String(prefix));
            this.saveValue(value);
        }
        else if (prefix instanceof _String) {
            this.savePrefix(prefix);
            this.saveValue(value);
        }
    }
    DictionaryXmlnsAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var value = new _DictionaryString();
        return value.consumeNBFXArray(arr);
    };
    DictionaryXmlnsAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    DictionaryXmlnsAttribute.prototype.getAttributeName = function () {
        return "xmlns:" + this.getPrefix().toNBFXString();
    };
    DictionaryXmlnsAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    DictionaryXmlnsAttribute._RecordType = 0x0B;
    DictionaryXmlnsAttribute._RecordTypeString = "DictionaryXmlnsAttribute";
    return DictionaryXmlnsAttribute;
})(_AttributeRecordXmlnsWithPrefix);
/// <reference path="../!ref.ts" />
var PrefixDictionaryAttribute = (function (_super) {
    __extends(PrefixDictionaryAttribute, _super);
    function PrefixDictionaryAttribute(prefix, name, value) {
        if (typeof prefix === "number") {
            this._prefix = $PrefixSingleCharUtil.ValueToChar(prefix);
        }
        else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }
            this._prefix = prefix.toLowerCase();
        }
        var recordType = PrefixDictionaryAttribute._RecordType + $PrefixSingleCharUtil.CharToValue(this._prefix);
        var recordTypeString = PrefixDictionaryAttribute._RecordTypeString + this._prefix.toUpperCase();
        _super.call(this, recordType, recordTypeString);
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveValue(value);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
    PrefixDictionaryAttribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    PrefixDictionaryAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    PrefixDictionaryAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    PrefixDictionaryAttribute.prototype.getAttributeName = function () {
        return this._prefix + ":" + this.getName().toNBFXString();
    };
    PrefixDictionaryAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    PrefixDictionaryAttribute._RecordType = 0x0C;
    PrefixDictionaryAttribute._RecordTypeString = "PrefixDictionaryAttribute";
    return PrefixDictionaryAttribute;
})(_AttributeRecordWithName);
/// <reference path="../!ref.ts" />
var PrefixAttribute = (function (_super) {
    __extends(PrefixAttribute, _super);
    function PrefixAttribute(prefix, name, value) {
        if (typeof prefix === "number") {
            this._prefix = $PrefixSingleCharUtil.ValueToChar(prefix);
        }
        else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }
            this._prefix = prefix.toLowerCase();
        }
        var recordType = PrefixAttribute._RecordType + $PrefixSingleCharUtil.CharToValue(this._prefix);
        var recordTypeString = PrefixAttribute._RecordTypeString + this._prefix.toUpperCase();
        _super.call(this, recordType, recordTypeString);
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveValue(value);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveValue(value);
        }
    }
    PrefixAttribute.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    PrefixAttribute.prototype.processValueFromNBFXArray = function (arr) {
        var valueTypeConsumeResult = _AttributeRecord.DetermineAttributeValueFromNBFXArray(arr);
        var value = valueTypeConsumeResult.object;
        arr = valueTypeConsumeResult.remainingArray;
        var valueConsumeResult = value.consumeNBFXArray(arr);
        // Because we read the type byte separate from the value consume, there is another byte in the total
        valueConsumeResult.consumedBytes += valueTypeConsumeResult.consumedBytes;
        return valueConsumeResult;
    };
    PrefixAttribute.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return " " + this.getAttributeName() + "=\"" + this.getAttributeValue(escapeXML) + "\"";
    };
    PrefixAttribute.prototype.getAttributeName = function () {
        return this._prefix + ":" + this.getName().toNBFXString();
    };
    PrefixAttribute.prototype.getAttributeValue = function (escapeXML) {
        return this.getValue().toNBFXString(escapeXML);
    };
    PrefixAttribute._RecordType = 0x26;
    PrefixAttribute._RecordTypeString = "PrefixAttribute";
    return PrefixAttribute;
})(_AttributeRecordWithName);
/// <reference path="ShortAttribute.ts" />
/// <reference path="Attribute.ts" />
/// <reference path="ShortDictionaryAttribute.ts" />
/// <reference path="DictionaryAttribute.ts" />
/// <reference path="ShortXmlnsAttribute.ts" />
/// <reference path="XmlnsAttribute.ts" />
/// <reference path="ShortDictionaryXmlnsAttribute.ts" />
/// <reference path="DictionaryXmlnsAttribute.ts" />
/// <reference path="PrefixDictionaryAttribute.ts" />
/// <reference path="PrefixAttribute.ts" /> 
/// <reference path="../!ref.ts" />
var ShortElement = (function (_super) {
    __extends(ShortElement, _super);
    function ShortElement(name, attributes) {
        _super.call(this, ShortElement._RecordType, ShortElement._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    ShortElement.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    ShortElement.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        var out = "<" + this.getName().toNBFXString();
        this.getAttributes().forEach(function (a) {
            out += a.toNBFXString(escapeXML);
        });
        return out + ">";
    };
    ShortElement._RecordType = 0x40;
    ShortElement._RecordTypeString = "ShortElement";
    return ShortElement;
})(_ElementRecord);
/// <reference path="../!ref.ts" />
var ElementRecord = (function (_super) {
    __extends(ElementRecord, _super);
    function ElementRecord(name, attributes) {
        _super.call(this, ElementRecord._RecordType, ElementRecord._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    ElementRecord.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    ElementRecord._RecordType = 0x41;
    ElementRecord._RecordTypeString = "Element";
    return ElementRecord;
})(_ElementRecordWithPrefix);
/// <reference path="../!ref.ts" />
var ShortDictionaryElement = (function (_super) {
    __extends(ShortDictionaryElement, _super);
    function ShortDictionaryElement(name, attributes) {
        _super.call(this, ShortDictionaryElement._RecordType, ShortDictionaryElement._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    ShortDictionaryElement.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    ShortDictionaryElement.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        var out = "<" + this.getName().toNBFXString();
        this.getAttributes().forEach(function (a) {
            out += a.toNBFXString(escapeXML);
        });
        return out + ">";
    };
    ShortDictionaryElement._RecordType = 0x42;
    ShortDictionaryElement._RecordTypeString = "ShortDictionaryElement";
    return ShortDictionaryElement;
})(_ElementRecord);
/// <reference path="../!ref.ts" />
var DictionaryElement = (function (_super) {
    __extends(DictionaryElement, _super);
    function DictionaryElement(name, attributes) {
        _super.call(this, DictionaryElement._RecordType, DictionaryElement._RecordTypeString);
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    DictionaryElement.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    DictionaryElement._RecordType = 0x43;
    DictionaryElement._RecordTypeString = "Element";
    return DictionaryElement;
})(_ElementRecordWithPrefix);
/// <reference path="../!ref.ts" />
var PrefixDictionaryElement = (function (_super) {
    __extends(PrefixDictionaryElement, _super);
    function PrefixDictionaryElement(prefix, name, attributes) {
        if (typeof prefix === "number") {
            this.savePrefix(new _String($PrefixSingleCharUtil.ValueToChar(prefix)));
        }
        else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }
            this.savePrefix(new _String(prefix.toLowerCase()));
        }
        var recordType = PrefixElement._RecordType + $PrefixSingleCharUtil.CharToValue(this.getPrefix().toString());
        var recordTypeString = PrefixElement._RecordTypeString + this.getPrefix().toString().toUpperCase();
        _super.call(this, recordType, recordTypeString, false);
        if (typeof name === "string") {
            this.saveName(new _DictionaryString(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _DictionaryString) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    PrefixDictionaryElement.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _DictionaryString();
        return name.consumeNBFXArray(arr);
    };
    PrefixDictionaryElement._RecordType = 0x44;
    PrefixDictionaryElement._RecordTypeString = "PrefixDictionaryElement";
    return PrefixDictionaryElement;
})(_ElementRecordWithPrefix);
/// <reference path="../!ref.ts" />
var PrefixElement = (function (_super) {
    __extends(PrefixElement, _super);
    function PrefixElement(prefix, name, attributes) {
        if (typeof prefix === "number") {
            this.savePrefix(new _String($PrefixSingleCharUtil.ValueToChar(prefix)));
        }
        else if (typeof prefix === "string") {
            if (prefix.length != 1) {
                throw new Error("Prefix invalid");
            }
            this.savePrefix(new _String(prefix.toLowerCase()));
        }
        var recordType = PrefixElement._RecordType + $PrefixSingleCharUtil.CharToValue(this.getPrefix().toString());
        var recordTypeString = PrefixElement._RecordTypeString + this.getPrefix().toString().toUpperCase();
        _super.call(this, recordType, recordTypeString, false);
        if (typeof name === "string") {
            this.saveName(new _String(name));
            this.saveAttributes(attributes);
        }
        else if (name instanceof _String) {
            this.saveName(name);
            this.saveAttributes(attributes);
        }
    }
    PrefixElement.prototype.processNameFromNBFXArray = function (arr) {
        var name = new _String();
        return name.consumeNBFXArray(arr);
    };
    PrefixElement._RecordType = 0x5E;
    PrefixElement._RecordTypeString = "PrefixElement";
    return PrefixElement;
})(_ElementRecordWithPrefix);
/// <reference path="ShortElement.ts" />
/// <reference path="Element.ts" />
/// <reference path="ShortDictionaryElement.ts" />
/// <reference path="DictionaryElement.ts" />
/// <reference path="PrefixDictionaryElement.ts" />
/// <reference path="PrefixElement.ts" /> 
/// <reference path="../!ref.ts" />
var EndElement = (function (_super) {
    __extends(EndElement, _super);
    function EndElement() {
        _super.call(this, EndElement._RecordType, EndElement._RecordTypeString);
    }
    EndElement.prototype.attachToElementRecord = function (elementRecord) {
        this._attachedElementRecord = elementRecord;
        return this;
    };
    EndElement.prototype.processNBFXArray = function (arr) {
        return {
            consumedBytes: 0,
            remainingArray: arr,
            object: this
        };
    };
    EndElement.prototype.toNBFXArray = function () {
        return new Uint8Array(0);
    };
    EndElement.prototype.consumeNBFXArray = function (arr) {
        return this.processNBFXArray(arr);
    };
    EndElement.prototype.generateNBFXStringRepresentation = function (radix, escapeXML) {
        return "</" + this._attachedElementRecord.getTagName() + ">";
    };
    EndElement.prototype.toNative = function () {
        return this.generateNBFXStringRepresentation();
    };
    EndElement._RecordType = 0x01;
    EndElement._RecordTypeString = "EndElement";
    return EndElement;
})(_NBFXRecord);
/// <reference path="EndElement.ts" /> 
/// <reference path="./Interfaces/!ref.ts" />
/// <reference path="./Errors/!ref.ts" />
/// <reference path="./UtilityClasses/!ref.ts" />
/// <reference path="./RecordAbstractClasses/!ref.ts" />
/// <reference path="./BaseRecordTypeClasses/!ref.ts" />
/// <reference path="./TextRecords/!ref.ts" />
/// <reference path="./AttributeRecords/!ref.ts" />
/// <reference path="./ElementRecords/!ref.ts" />
/// <reference path="./MiscRecords/!ref.ts" /> 
/// <reference path="./!ref.ts" />
var NBFX = (function () {
    function NBFX() {
        this._records = new Array();
    }
    NBFX.DetermineRecordFromNBFXArray = function (arr, elementStack) {
        var recordType = $Uint8ArrayUtil.Extract(arr, 1)[0];
        var record = null;
        // Text records
        switch (recordType & 0xFE) {
            // TODO: Change to use record type already defined statically in these constructors rather than hard coded points
            case 0x80:
                record = new ZeroText();
                break;
            case 0x82:
                record = new OneText();
                break;
            case 0x84:
                record = new FalseText();
                break;
            case 0x86:
                record = new TrueText();
                break;
            case 0x88:
                record = new Int8Text();
                break;
            case 0x8A:
                record = new Int16Text();
                break;
            case 0x8C:
                record = new Int32Text();
                break;
            // case 0x8E: record = new Int64Text(); break;
            case 0x90:
                record = new FloatText();
                break;
            case 0x92:
                record = new DoubleText();
                break;
            // case 0x94: record = new DecimalText(); break;
            // case 0x96: record = new DateTimeText(); break;
            case 0x98:
                record = new Chars8Text();
                break;
            case 0x9A:
                record = new Chars16Text();
                break;
            case 0x9C:
                record = new Chars32Text();
                break;
            case 0x9E:
                record = new Bytes8Text();
                break;
            case 0xA0:
                record = new Bytes16Text();
                break;
            case 0xA2:
                record = new Bytes32Text();
                break;
            // case 0xA4: record = new StartListText(); break;
            // case 0xA6: record = new EndListText(); break;
            case 0xA8:
                record = new EmptyText();
                break;
            case 0xAA:
                record = new DictionaryText();
                break;
            case 0xAC:
                record = new UniqueIdText();
                break;
            // case 0xAE: record = new TimeSpanText(); break;
            case 0xB0:
                record = new UuidText();
                break;
            // case 0xB2: record = new UInt64Text(); break;
            case 0xB4:
                record = new BoolText();
                break;
            case 0xB6:
                record = new UnicodeChars8Text();
                break;
            case 0xB8:
                record = new UnicodeChars16Text();
                break;
            case 0xBA:
                record = new UnicodeChars32Text();
                break;
            case 0xBC:
                record = new QNameDictionaryText();
                break;
        }
        // *TextWithEndElement
        if (record && (recordType & 0x01)) {
            record.attachToElementRecord(elementStack.pop());
        }
        // Misc + element records
        if (!record) {
            switch (recordType) {
                // Misc
                case EndElement._RecordType:
                    record = new EndElement();
                    record.attachToElementRecord(elementStack.pop());
                    break;
                // TODO: 0x02
                // TODO: 0x03
                // Std element
                case ShortElement._RecordType:
                    record = new ShortElement();
                    break;
                case ElementRecord._RecordType:
                    record = new ElementRecord();
                    break;
                case ShortDictionaryElement._RecordType:
                    record = new ShortDictionaryElement();
                    break;
                case DictionaryElement._RecordType:
                    record = new DictionaryElement();
                    break;
            }
        }
        // Prefix*Element records
        if (!record) {
            // (a to z = 0 to 25)
            if (recordType >= PrefixDictionaryElement._RecordType) {
                if (recordType <= PrefixDictionaryElement._RecordType + 25) {
                    record = new PrefixDictionaryElement(recordType - PrefixDictionaryElement._RecordType);
                }
                else if (recordType <= PrefixElement._RecordType + 25) {
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
        };
    };
    NBFX.prototype.fromUint8Array = function (arr) {
        if (this.getRecords().length > 0) {
            return this;
        }
        var elementStack = [];
        var consumedBytes = 0;
        while (arr.byteLength > 0) {
            // Detect
            var recordTypeConsumeResult = NBFX.DetermineRecordFromNBFXArray(arr, elementStack);
            consumedBytes += recordTypeConsumeResult.consumedBytes;
            arr = recordTypeConsumeResult.remainingArray;
            // Process
            var record = recordTypeConsumeResult.object;
            var recordConsumeResult = record.consumeNBFXArray(arr);
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
    };
    NBFX.prototype.getRecords = function () {
        return this._records;
    };
    NBFX.prototype.toNBFXString = function (escapeXML) {
        if (escapeXML === void 0) { escapeXML = false; }
        var out = "";
        this._records.forEach(function (r) {
            out += r.toNBFXString(escapeXML);
        });
        return out;
    };
    NBFX.prototype.toXML = function () {
        var newDoc = document.implementation.createDocument("", "", null);
        var elementStack = [];
        var activeElement = function () { return elementStack[elementStack.length - 1]; };
        this._records.forEach(function (r) {
            if (r instanceof _TextRecord) {
                activeElement().appendChild(newDoc.createTextNode(r.getTextContent(false)));
                // If terminated, pop
                if (r.hasAttachedElementRecord()) {
                    elementStack.pop();
                }
            }
            else if (r instanceof _ElementRecord) {
                // Push new element in
                var parent = activeElement();
                if (!parent) {
                    parent = newDoc;
                }
                elementStack.push(parent.appendChild(newDoc.createElement(r.getTagName())));
                // Append attributes
                r.getAttributes().forEach(function (a) {
                    activeElement().setAttribute(a.getAttributeName(), a.getAttributeValue(false));
                });
            }
            else if (r instanceof EndElement) {
                // If terminated, pop
                elementStack.pop();
            }
            else {
                throw new UnrecognisedRecordError("Unrecognised record in document");
            }
        });
        return newDoc;
    };
    NBFX.prototype.toString = function () {
        if (this._records.length === 0) {
            return null;
        }
        return new XMLSerializer().serializeToString(this.toXML());
    };
    return NBFX;
})();
