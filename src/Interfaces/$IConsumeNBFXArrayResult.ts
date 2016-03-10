/// <reference path="../!ref.ts" />

interface $IConsumeNBFXArrayResult<T> {
    consumedBytes: number,
    remainingArray: Uint8Array,
    object: T
}