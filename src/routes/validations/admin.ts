import { query } from "express-validator";
import { BadRequestError } from "../../errors/BadRequestError";

export const adminDatesValidation = [
    query('start')
        .exists()
        .withMessage('`start` date is required.')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Invalid `start` date format. Format should be YYYY-MM-DD.')
        .custom(value => {
            const dateInstance = new Date(value);
            const dateComponents = value.split('-').map((str: any) => parseInt(str, 10));
            if (
                dateComponents[0] !== dateInstance.getUTCFullYear() ||
                dateComponents[1] !== dateInstance.getUTCMonth() + 1 ||  // Months are 0-indexed in JavaScript
                dateComponents[2] !== dateInstance.getUTCDate()
            ) {
                throw new BadRequestError('Invalid `start` date.');
            }
            return true;
        }),
    query('end')
        .exists()
        .withMessage('`end` date is required.')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Invalid `end` date format. Format should be YYYY-MM-DD.')
        .custom((value, { req }) => {
            const dateInstance = new Date(value);
            const dateComponents = value.split('-').map((str: any) => parseInt(str, 10));
            if (
                dateComponents[0] !== dateInstance.getUTCFullYear() ||
                dateComponents[1] !== dateInstance.getUTCMonth() + 1 ||
                dateComponents[2] !== dateInstance.getUTCDate()
            ) {
                throw new BadRequestError('Invalid `end` date.');
            }

            if (value < req.query?.start) {
                throw new BadRequestError('`end` date should be greater than or equal to start date.');
            }

            return true;
        })
];