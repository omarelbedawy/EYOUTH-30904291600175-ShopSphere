const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@shop.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    const customer = await prisma.user.create({
        data: {
            name: 'Test Customer',
            email: 'customer@shop.com',
            password: hashedPassword,
            role: 'CUSTOMER'
        }
    });

    await prisma.product.createMany({
        data: [
            { name: 'Blue T-Shirt', price: 20, description: 'Cotton crew neck', stock: 50 },
            { name: 'Black Hoodie', price: 45, description: 'Warm fleece hoodie', stock: 30 },
            { name: 'Denim Jeans', price: 60, description: 'Slim fit jeans', stock: 20 }
        ]
    });

    console.log('Seed data created:', { admin: admin.email, customer: customer.email });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
