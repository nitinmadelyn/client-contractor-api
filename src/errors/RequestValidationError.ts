import { ValidationError } from 'express-validator';
import { WrapperError } from './WrapperError';

export class RequestValidationError extends WrapperError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('super: Request validation error');

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return { status: false, message: this.errors[0].msg };
    }
}
