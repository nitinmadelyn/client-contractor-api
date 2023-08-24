import { WrapperError } from './WrapperError';

export class NotFoundError extends WrapperError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return { status: false, message: this.message };
    }
}
