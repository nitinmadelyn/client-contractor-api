import { seedData } from "../../scripts/seedData";
import { Profile, sequelize, Contract, Job } from '../models/model';

beforeAll(async () => {
    await seedData();
});

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await sequelize.close();
});
