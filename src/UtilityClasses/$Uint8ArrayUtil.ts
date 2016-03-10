/// <reference path="../!ref.ts" />

class $Uint8ArrayUtil {
    public static Extract(arr: Uint8Array, bytes: number): Uint8Array {
        return arr.subarray(0, bytes);
    }
    
    public static Advance(arr: Uint8Array, bytes: number): Uint8Array {
        return arr.subarray(bytes);
    }

    public static ArrayToStringArray(arr: Uint8Array, radix: number = 16): Array<string> {
        var outStringArray: Array<string> = new Array<string>();

        for (var i = 0; i < arr.length; ++i) {
            outStringArray.push(arr[i].toString(radix));
        }

        return outStringArray;
    }
    
    public static DataView(arr: Uint8Array): DataView {
        return new DataView(arr.buffer, arr.byteOffset);
    }
}