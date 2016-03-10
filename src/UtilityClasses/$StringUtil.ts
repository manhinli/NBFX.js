/// <reference path="../!ref.ts" />

class $StringUtil {
    public static PadLeft(str: string, length: number, padChar: string = "0") {
        while (str.length < length) {
            str = padChar + str;
        }

        return str;
    }
}