import request from 'supertest';
import { app } from '../../app';

describe('Pay for a job:', () => {
    it('should return 400, invalid job_id', async () => {
        const response = await request(app)
            .post('/jobs/abcd/pay')
            .set('profile_id', '1')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('`job_id` must be of type number');
    });

    it('should return 200, payment transfer success', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Payment transfered successfully.');
    });

    it('should return 400, only client can pay', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '5')
            .expect(400);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Only client can pay.');
    });

    it('should return 404, job not found', async () => {
        const response = await request(app)
            .post('/jobs/100/pay')
            .set('profile_id', '1')
            .expect(404);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Job not found.');
    });

    it('should return 500, can`t pay to other jobs', async () => {
        const response = await request(app)
            .post('/jobs/3/pay')
            .set('profile_id', '1')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('You can`t pay for this job.');
    });

    it('should return 200, paid successfully', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Payment transfered successfully.');
    });

    it('should return 500, already paid for job', async () => {
        await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(200);

        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('You have already paid for this job.');
    });

    it('should return 500, insufficient balance', async () => {
        const res = await request(app)
            .post('/jobs/4/pay')
            .set('profile_id', '2')
            .expect(200);
        // console.log(res.body);

        const response = await request(app)
            .post('/jobs/3/pay')
            .set('profile_id', '2')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('You have insufficient balance.');
    });

    // this needs to be mock
    xit('should return 500, transaction failed', async () => {
        const response = await request(app)
            .post('/jobs/1/pay')
            .set('profile_id', '1')
            .expect(500);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(false);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Failed to transfer.');
    })
});

describe('Unpaid jobs:', () => {
    it('should return 200, all unpaid jobs for client', async () => {
        const response = await request(app)
            .get('/jobs/unpaid')
            .set('profile_id', '1')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.data).toEqual('object');
    });

    it('should return 200, all unpaid jobs for contractor', async () => {
        const response = await request(app)
            .get('/jobs/unpaid')
            .set('profile_id', '6')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual(true);
        expect(response.body).toHaveProperty('data');
        expect(typeof response.body.data).toEqual('object');
    })
});