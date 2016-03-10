/// <reference path="../!ref.ts" />

abstract class _UuidText extends _FixedLengthText {
    private static _Length: number = 16;

    public toNative(): string {
        return this.generateNBFXStringRepresentation();
    }

    public getTextContent(escapeXML?: boolean) {
        var dataView: DataView = this.uint8DataView();

        var data1: number = dataView.getUint32(0, true);
        var data2: number = dataView.getUint16(4, true);
        var data3: number = dataView.getUint16(6, true);
        var data4_1: number = dataView.getUint8(8);
        var data4_2: number = dataView.getUint8(9);
        var data4_3: number = dataView.getUint8(10);
        var data4_4: number = dataView.getUint8(11);
        var data4_5: number = dataView.getUint8(12);
        var data4_6: number = dataView.getUint8(13);
        var data4_7: number = dataView.getUint8(14);
        var data4_8: number = dataView.getUint8(15);

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
    }

    constructor(_recordType: number, _recordTypeString: string) {
        super(_recordType,
            _recordTypeString,
            _UuidText._Length);
    }
}