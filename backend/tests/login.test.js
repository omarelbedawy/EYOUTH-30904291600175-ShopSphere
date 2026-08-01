const request = require('supertest');
const app = require('../index');

describe('POST /users/login', () => {
    it('should return 401 for wrong password', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({ email: 'customer@shop.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({ email: 'doesnotexist@shop.com', password: 'whatever' });

        expect(response.status).toBe(404);
    });

    it('should return 200 and a role for correct credentials', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({ email: 'customer@shop.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.role).toBe('CUSTOMER');
    });
});