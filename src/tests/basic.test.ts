import request from 'supertest';
import { app } from '../app';

describe('All basic tests:', () => {
    it('should return 404, route not found', async () => {
        const response = await request(app)
            .get('/test')
            .expect(404);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Route not found.');
    });

    it('should return 404, missing profile_id', async () => {
        const response = await request(app)
            .get('/contracts/1')
            .send({})
            .expect(404);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Profile not found.');
    });
});