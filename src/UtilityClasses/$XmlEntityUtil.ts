/// <reference path="../!ref.ts" />

class $XmlEntityUtil {
    // http://stackoverflow.com/a/27979933 
    public static Escape(str: string): string {
        return str.replace(/[<>&'"]/g, function(c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
    }
}