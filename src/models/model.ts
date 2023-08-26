import { Sequelize, Model, DataTypes } from "sequelize";
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];
const sequelize = new Sequelize(config);


class Profile extends Model { }
Profile.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profession: {
            type: DataTypes.STRING,
            allowNull: false
        },
        balance: {
            type: DataTypes.DECIMAL(12, 2)
        },
        type: {
            type: DataTypes.ENUM('client', 'contractor')
        }
    },
    {
        sequelize,
        modelName: 'Profile'
    }
);

class Contract extends Model { }
Contract.init(
    {
        terms: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'terminated')
        }
    },
    {
        sequelize,
        modelName: 'Contract'
    }
);

class Job extends Model { }
Job.init(
    {
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        paymentDate: {
            type: DataTypes.DATE
        }
    },
    {
        sequelize,
        modelName: 'Job'
    }
);

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

async function transferPayment(clientId: number, contractorId: number, amount: number, jobId: string) {
    return sequelize.transaction(async (t) => {
        const client: any = await Profile.findByPk(clientId, { transaction: t });
        const contractor: any = await Profile.findByPk(contractorId, { transaction: t });

        if (!client || !contractor) {
            throw new Error('Client or Contractor not found');
        }

        const dateToUpdate = new Date().toISOString();
        client.balance -= amount;
        client.updatedAt = dateToUpdate;
        contractor.balance += amount;
        contractor.updatedAt = dateToUpdate;

        await client.save({ transaction: t });
        await contractor.save({ transaction: t });

        const job: any = await Job.findByPk(jobId, { transaction: t });
        job.paid = true;
        job.paymentDate = dateToUpdate;
        job.updatedAt = dateToUpdate;
        await job.save({ transaction: t });
    });
}

export { Profile, Contract, Job, sequelize, transferPayment };