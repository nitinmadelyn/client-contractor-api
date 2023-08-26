import request from 'supertest';
import { app } from '../../app';

describe('Get Contract by `id`:', () => {

    it('should return 400, invalid id', async () => {
        const response = await request(app)
            .get('/contracts/abcd')
            .set('profile_id', '1')
            .send({})
            .expect(400);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`id` must be of type number');
    });

    it('should return 404, contract not found', async () => {
        const response = await request(app)
            .get('/contracts/3')
            .set('profile_id', '1')
            .send({})
            .expect(404);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Contract not found.');
    });

    it('should return 200, with contract details', async () => {
        const response = await request(app)
            .get('/contracts/1')
            .set('profile_id', '1')
            .send({})
            .expect(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.data).toBe('object');
    });

});

describe('Get Contract by `profile_id`:', () => {
    it('should return 200, no contract found', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('profile_id', '5')
            .send({})
            .expect(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
    });

    it('should return 200, with contracts details', async () => {
        const response = await request(app)
            .get('/contracts')
            .set('profile_id', '1')
            .send({})
            .expect(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toEqual(1);
    });
});