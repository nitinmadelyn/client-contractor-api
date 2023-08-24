import express, { Request, Response } from 'express';
import { getProfile } from '../middlewares/getProfile';
import { Contract } from '../models/model';
import { NotFoundError } from '../errors/NotFoundError';
import { contractValidation } from './validations/contracts';
import { validateRequest } from '../middlewares/validateRequest';
const router = express.Router();

router.get(
    '/contracts/:id',
    contractValidation,
    validateRequest,
    getProfile,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const profileId = req.profile?.id;

        const condition = req.profile?.type === 'client' ? { ClientId: profileId } : { ContractorId: profileId };
        const contract = await Contract.findOne({ where: { ...condition, id } });

        if (!contract) {
            throw new NotFoundError('Contract not found.');
        }
        res.status(200).send(contract);
    });

export { router as contractRouter };