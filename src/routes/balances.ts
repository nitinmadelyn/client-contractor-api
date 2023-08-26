import express, { Request, Response } from 'express';
import { getProfile } from '../middlewares/getProfile';
import { Contract, Job, Profile, sequelize } from '../models/model';
import { ServerError } from '../errors/ServerError';
import { balanceValidation } from './validations/balances';
import { validateRequest } from '../middlewares/validateRequest';
import { Op } from 'sequelize';
const router = express.Router();

router.post(
    '/balances/deposit/:amount',
    balanceValidation,
    validateRequest,
    getProfile,
    async (req: Request, res: Response) => {
        const amount = parseFloat(req.params.amount);
        const clientId = req.profile?.id;

        const client: any = await Profile.findByPk(clientId);
        if (client.type !== 'client') {
            throw new ServerError('Only client can deposit money.')
        }

        const jobs = await Job.findAll({
            include: [
                {
                    model: Contract,
                    where: { ClientId: clientId, status: 'in_progress' } // considering only active contracts
                }
            ],
            where: { paid: false },
            attributes: ['price']
        });
        const totalUnpaidJobsAmount = jobs.reduce((sum, job: any) => sum + parseFloat(job.price), 0);
        const maxAllowedDeposit = totalUnpaidJobsAmount * 0.25;

        if (amount > maxAllowedDeposit) {
            throw new ServerError(`Cannot deposit more than 25% of total unpaid jobs. Maximum allowed deposit is ${maxAllowedDeposit}.`);
        }

        try {
            await sequelize.transaction(async (t) => {
                // Update client's balance
                client.balance += amount;
                client.updatedAt = new Date().toISOString();
                await client.save({ transaction: t });
            })
        } catch (error) {
            console.error(error);
            throw new ServerError('Failed to deposit.');
        }

        res.status(200).send({ status: true, message: 'Amount deposited successfully.' });
    });

export { router as balanceRouter };
