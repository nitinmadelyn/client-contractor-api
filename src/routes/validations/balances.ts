import { param } from "express-validator";

export const balanceValidation = [
    param('amount')
        .isNumeric()
        .withMessage('`amount` must be of type number')
];