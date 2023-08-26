import express, { Request, Response } from 'express';
import { getProfile } from '../middlewares/getProfile';
import { Contract } from '../models/model';
import { NotFoundError } from '../errors/NotFoundError';
import { contractValidation } from './validations/contracts';
import { validateRequest } from '../middlewares/validateRequest';
import { Op } from 'sequelize';
const router = express.Router();

router.get(
    '/contracts',
    getProfile,
    async (req: Request, res: Response) => {
        const profileId = req.profile?.id;

        const condition = req.profile?.type === 'client' ? { ClientId: profileId } : { ContractorId: profileId };
        const contracts: any = await Contract.findAll({
            where: { ...condition, status: { [Op.ne]: 'terminated' } },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        res.status(200).send({ status: true, data: contracts });
    });

router.get(
    '/contracts/:id',
    contractValidation,
    validateRequest,
    getProfile,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const profileId = req.profile?.id;

        const condition = req.profile?.type === 'client' ? { ClientId: profileId } : { ContractorId: profileId };
        const contract: any = await Contract.findOne({
            where: { ...condition, id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        if (!contract) {
            throw new NotFoundError('Contract not found.');
        }

        res.status(200).send({ status: true, data: contract });
    });

export { router as contractRouter };