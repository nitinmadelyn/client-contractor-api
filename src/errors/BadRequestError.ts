import { WrapperError } from './WrapperError';

export class BadRequestError extends WrapperError {
    statusCode = 400;
    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return { status: false, message: this.message };
    }
}
