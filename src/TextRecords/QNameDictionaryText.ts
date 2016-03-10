/// <reference path="../!ref.ts" />

class QNameDictionaryText extends _FixedLengthText {
    public static _RecordType: number = 0xBC;
    public static _RecordTypeString: string = "QNameDictionaryText";

    private static _Length: number = 4;

    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    public getTextContent(escapeXML?: boolean): string {
        var dataView: DataView = this.uint8DataView();

        var prefix: number = dataView.getUint8(0);
        var name: _DictionaryString = new _DictionaryString();

        name.consumeNBFXArray(new Uint8Array(this.uint8().buffer, 1, 3));

        return $PrefixSingleCharUtil.ValueToChar(prefix) + ":" + name.toNBFXString();
    }

    constructor(arr?: Uint8Array) {
        super(QNameDictionaryText._RecordType,
            QNameDictionaryText._RecordTypeString,
            QNameDictionaryText._Length);

        if (arr instanceof Uint8Array) {
            this.uint8(arr);
        }
    }
}