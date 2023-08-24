import { Request, Response, NextFunction } from 'express';
import { WrapperError } from '../errors/WrapperError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof WrapperError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }

    return res.status(400).send({ status: false, message: err.message });
};
