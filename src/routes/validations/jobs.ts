import { param } from "express-validator";

export const jobValidation = [
    param('job_id')
        .isNumeric()
        .withMessage('`job_id` must be of type number')
];