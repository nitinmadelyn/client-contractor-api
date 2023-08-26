import { WrapperError } from './WrapperError';

export class ServerError extends WrapperError {
    statusCode = 500;
    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, ServerError.prototype);
    }
    serializeErrors() {
        return { status: false, message: this.message };
    }
}
