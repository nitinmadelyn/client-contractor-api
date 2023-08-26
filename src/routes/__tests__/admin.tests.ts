import request from 'supertest';
import { app } from '../../app';

describe('Admin - Best performer:', () => {
    it('should return 400, start date missing', async () => {
        const response = await request(app)
            .get('/admin/best-profession')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`start` date is required.');
    });

    it('should return 400, start date invalid format', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=dummydate')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `start` date format. Format should be YYYY-MM-DD.');
    });

    it('should return 400, start date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-99')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `start` date.');
    });

    it('should return 400, end date missing', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-10')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`end` date is required.');
    });

    it('should return 400, end date invalid format', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-10&end=dummydate')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `end` date format. Format should be YYYY-MM-DD.');
    });

    it('should return 400, end date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-10&end=2020-08-99')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `end` date.');
    });

    it('should return 200, end date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-profession?start=2020-08-15&end=2020-08-16')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('profession');
        expect(response.body.profession).toEqual('Programmer');
    });
});

describe('Admin - Best client:', () => {
    it('should return 400, start date missing', async () => {
        const response = await request(app)
            .get('/admin/best-clients')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`start` date is required.');
    });

    it('should return 400, start date invalid format', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=dummydate')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `start` date format. Format should be YYYY-MM-DD.');
    });

    it('should return 400, start date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-99')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `start` date.');
    });

    it('should return 400, end date missing', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-10')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`end` date is required.');
    });

    it('should return 400, end date invalid format', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-10&end=dummydate')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `end` date format. Format should be YYYY-MM-DD.');
    });

    it('should return 400, end date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-10&end=2020-08-99')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Invalid `end` date.');
    });

    it('should return 200, with client list', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-15&end=2020-08-16')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.data).toEqual('object');
        const length = response.body.data.length;
        expect(length).toBe(2);
    });

    it('should return 200, end date invalid', async () => {
        const response = await request(app)
            .get('/admin/best-clients?start=2020-08-15&end=2020-08-16&limit=3')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.data).toEqual('object');
        const length = response.body.data.length;
        expect(length).toBe(3);
    });
});