/// <reference path="../!ref.ts" />

class $PrefixSingleCharUtil {
    private static _Dictionary: Array<string> = [
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

    public static ValueToChar(value: number): string {
        var char: string = $PrefixSingleCharUtil._Dictionary[value];

        if (!char) {
            throw new Error("Character index value not valid");
        }

        return char;
    }

    public static CharToValue(char: string): number {
        var value: number = $PrefixSingleCharUtil._Dictionary.indexOf(char);

        if (value < 0) {
            throw new Error("Character value not found");
        }

        return value;
    }
}