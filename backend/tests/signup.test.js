const request = require('supertest');
const app = require('../index');

describe('POST /users', () => {
    it('should create a new user and return 201', async () => {
        const uniqueEmail = `testuser_${Date.now()}@shop.com`;

        const response = await request(app)
            .post('/users')
            .send({ name: 'Test User', email: uniqueEmail, password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.email).toBe(uniqueEmail);
        expect(response.body.password).not.toBe('password123'); // must be hashed, not plain
    });

    it('should fail with 500 if email already exists', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'Duplicate', email: 'customer@shop.com', password: 'password123' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
    });
});