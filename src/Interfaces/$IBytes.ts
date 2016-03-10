/// <reference path="../!ref.ts" />

interface $INBFX {
    toNBFXArray(): Uint8Array;
    toNBFXString(escapeXML: boolean): string;
    consumeNBFXArray(arr: Uint8Array): $IConsumeNBFXArrayResult<this>
}