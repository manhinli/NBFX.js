/// <reference path="../!ref.ts" />

declare var escape: (str: string) => string;
    
class $UnicodeUtil {
    
    /**
     * Encodes string in JS (should be UTF-16) to UTF-8
     */
    // http://stackoverflow.com/a/18729931 (faster)
    public static StringToUTF8Array(str: string): Uint8Array {
        var utf8 = [];

        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (str.charCodeAt(i) & 0x3ff))
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }

        return new Uint8Array(utf8);
    }
    
    // http://stackoverflow.com/a/17192845
    // TODO: May have problems with stack?
    public static UTF8ArrayToString(arr: Uint8Array): string {
        var encodedString = String.fromCharCode.apply(null, arr);
        
        return decodeURIComponent(escape(encodedString));
    }
    
    public static StringToUTF16Array(str: string, littleEndian?: boolean): Uint8Array {
        var out: Uint8Array = new Uint8Array(str.length * 2);

        var dataView = $Uint8ArrayUtil.DataView(out);

        for (var i = 0; i < str.length; ++i) {
            var charcode = str.charCodeAt(i);
            dataView.setUint16(i * 2, charcode, littleEndian);
        }

        return out;
    }

    public static UTF16ArrayToString(arr: Uint8Array, littleEndian?: boolean): string {
        var out: string = "";

        if (arr.byteLength % 2) {
            throw new Error("Array not even length");
        }

        var dataView = $Uint8ArrayUtil.DataView(arr);

        for (var i = 0; i < arr.byteLength; i += 2) {
            out += String.fromCharCode(dataView.getUint16(i, littleEndian));
        }

        return out;
    }
}