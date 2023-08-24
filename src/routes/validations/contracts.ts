import { param } from "express-validator";

export const contractValidation = [
    param('id')
        .isNumeric()
        .withMessage('`id` must be of type number')
];

