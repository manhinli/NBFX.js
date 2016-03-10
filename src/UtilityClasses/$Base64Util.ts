/// <reference path="../!ref.ts" />

class $Base64Util {
    // http://stackoverflow.com/a/25644409
    public static Uint8ArrayToBase64(arr: Uint8Array): string {
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
    }

    // http://stackoverflow.com/a/12713326
    public static Base64toUint8Array(str: string): Uint8Array {
        return new Uint8Array(atob(str).split("").map((c) => { return c.charCodeAt(0); }));
    }
}