/// <reference path="../!ref.ts" />

class $NumberUtil {
    public static IsNaN(value: number): boolean {
        return isNaN(value);
    }
    public static IsPosInf(value: number): boolean {
        return (value === Number.POSITIVE_INFINITY);
    }
    public static IsNegInf(value: number): boolean {
        return (value === Number.NEGATIVE_INFINITY);
    }
    public static IsNegZero(value: number): boolean {
        return (value === 0 && 1 / value === Number.NEGATIVE_INFINITY);
    }
    public static ToNBFXString(value: number, radix: number = 10): string {
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
    }
}