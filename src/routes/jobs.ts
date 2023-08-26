import express, { Request, Response } from 'express';
import { getProfile } from '../middlewares/getProfile';
import { Contract, Job, Profile, transferPayment } from '../models/model';
import { BadRequestError } from '../errors/BadRequestError';
import { jobValidation } from './validations/jobs';
import { validateRequest } from '../middlewares/validateRequest';
import { ServerError } from '../errors/ServerError';
import { NotFoundError } from '../errors/NotFoundError';
const router = express.Router();


router.get(
    '/jobs/unpaid',
    getProfile,
    async (req: Request, res: Response) => {
        const profileId = req.profile?.id;

        const condition = req.profile?.type === 'client' ? { ClientId: profileId } : { ContractorId: profileId };
        const unpaidJobs = await Job.findAll({
            where: { paid: false },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [{
                model: Contract,
                where: {
                    ...condition,
                    status: 'in_progress'
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }]
        });

        res.status(200).send({ status: true, data: unpaidJobs });
    });

router.post(
    '/jobs/:job_id/pay',
    jobValidation,
    validateRequest,
    getProfile,
    async (req: Request, res: Response) => {
        if (req.profile?.type !== 'client') {
            throw new BadRequestError('Only client can pay.');
        }
        const jobId = req.params.job_id;

        const job: any = await Job.findOne({
            where: { id: jobId },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [{
                model: Contract,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [{
                    model: Profile,
                    as: 'Client',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }]
            }]
        });

        if (!job) {
            throw new NotFoundError('Job not found.');
        }
        const jobDetails = job.toJSON();

        // check if this job does not belong to this client
        if (jobDetails.Contract.ClientId !== req.profile?.id) {
            throw new ServerError('You can`t pay for this job.');
        }

        // check if already paid
        if (jobDetails.paid === true) {
            throw new ServerError('You have already paid for this job.');
        }

        // check if client have sufficient balance
        if (jobDetails.Contract.Client.balance < jobDetails.price) {
            throw new ServerError('You have insufficient balance.');
        }

        const clientId = parseInt(req.profile?.id);
        const contractorId = jobDetails.Contract.ContractorId;
        const amount = jobDetails.price;
        try {
            await transferPayment(clientId, contractorId, amount, jobId);
        } catch (error) {
            console.error(error);
            throw new ServerError('Failed to transfer.');
        }

        res.status(200).send({ status: true, message: 'Payment transfered successfully.' });
    });

export { router as jobRouter };