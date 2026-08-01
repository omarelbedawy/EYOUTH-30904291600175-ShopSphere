const request = require('supertest');
const app = require('../index');

describe('POST /orders (protected)', () => {
    it('should reject creating an order without a token', async () => {
        const response = await request(app)
            .post('/orders')
            .send({ items: [{ productId: 1, quantity: 1 }] });

        expect(response.status).toBe(401);
    });
});

describe('GET /orders (protected)', () => {
    it('should reject fetching orders without a token', async () => {
        const response = await request(app).get('/orders');

        expect(response.status).toBe(401);
    });
});