class UnrecognisedRecordError extends Error {
    public name = "UnrecognisedRecordError";
    constructor (public message?: string) {
        super(message);
    }
}