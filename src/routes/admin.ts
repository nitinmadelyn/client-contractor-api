import express, { Request, Response } from 'express';
import { adminDatesValidation } from './validations/admin';
import { validateRequest } from '../middlewares/validateRequest';
import { Contract, Job, Profile, sequelize } from '../models/model';
import { Op } from 'sequelize';
const router = express.Router();


router.get(
    '/admin/best-profession',
    adminDatesValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { start, end } = req.query as any;

        // adjust start & end date
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);

        const result = await Job.findAll({
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [startDate.toISOString(), endDate.toISOString()]
                }
            },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'totalEarnings']
            ],
            include: [{
                model: Contract,
                include: [{
                    model: Profile,
                    as: 'Contractor',
                    attributes: ['profession']
                }]
            }],
            group: [sequelize.col('Contract->Contractor.profession')],
            order: [
                [sequelize.fn('SUM', sequelize.col('price')), 'DESC']
            ],
            limit: 1
        });

        const profession = result.length > 0 ? result[0].toJSON().Contract.Contractor.profession : null;
        res.status(200).send({ status: true, profession });;
    });

router.get(
    '/admin/best-clients',
    adminDatesValidation,
    validateRequest,
    async (req: Request, res: Response) => {
        const { start, end, limit } = req.query as any;
        const limitValue = limit || 2;

        // adjust start & end date
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);

        const result = await Job.findAll({
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [startDate.toISOString(), endDate.toISOString()]
                }
            },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'totalPayments']
            ],
            include: [{
                model: Contract,
                include: [{
                    model: Profile,
                    as: 'Client',
                    attributes: ['id', 'firstName', 'lastName']
                }]
            }],
            group: ['Contract.ClientId'],
            order: [
                [sequelize.fn('SUM', sequelize.col('price')), 'DESC']
            ],
            limit: limitValue
        });

        const clientsData = result.map(instance => instance.toJSON());
        const clients: any = [];
        clientsData.forEach(client => {
            const data = {
                id: client.Contract.Client.id,
                fullName: client.Contract.Client.firstName + ' ' + client.Contract.Client.lastName,
                paid: client.totalPayments
            }
            clients.push(data)
        })

        res.status(200).send({ status: true, data: clients });;
    });

export { router as adminRouter };