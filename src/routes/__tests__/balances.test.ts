import request from 'supertest';
import { app } from '../../app';

describe('Balance tests:', () => {
    it('should return 400, amount should be of type number', async () => {
        const response = await request(app)
            .post('/balances/deposit/amount')
            .set('profile_id', '1')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`amount` must be of type number');
    });

    it('should return 500, only client can deposit', async () => {
        const response = await request(app)
            .post('/balances/deposit/100')
            .set('profile_id', '5')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Only client can deposit money.');
    });

    it('should return 200, deposit success', async () => {
        const response = await request(app)
            .post('/balances/deposit/10')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Amount deposited successfully.');
    });

    it('should return 500, can`t deposit more than 25%', async () => {
        const response = await request(app)
            .post('/balances/deposit/1000')
            .set('profile_id', '1')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Cannot deposit more than 25% of total unpaid jobs. Maximum allowed deposit is 50.25.');
    });
});