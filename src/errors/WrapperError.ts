export abstract class WrapperError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, WrapperError.prototype);
    }

    abstract serializeErrors(): {
        status: boolean;
        data?: object;
        message?: string;
    };
}
