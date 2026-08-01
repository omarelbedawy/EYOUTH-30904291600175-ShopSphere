const request = require('supertest');
const app = require('../index');

describe('GET /products', () => {
    it('should return a list of products with pagination info', async () => {
        const response = await request(app).get('/products?page=1&limit=6');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
    });

    it('should filter products by search term', async () => {
        const response = await request(app).get('/products?search=Shirt');

        expect(response.status).toBe(200);
        response.body.products.forEach(product => {
            expect(product.name.toLowerCase()).toContain('shirt');
        });
    });
});

describe('POST /products (protected, admin only)', () => {
    it('should reject creating a product without a token', async () => {
        const response = await request(app)
            .post('/products')
            .send({ name: 'Unauthorized Product', price: 10, stock: 5 });

        expect(response.status).toBe(401);
    });
});