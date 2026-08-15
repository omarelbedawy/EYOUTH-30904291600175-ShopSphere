const prisma = require('../utils/prisma');
const supabase = require('../utils/supabase');

const BUCKET = 'product-images';
const driver = process.env.STORAGE_DRIVER || 'supabase';

async function createProduct(req, res) {
    try {
        const { name, price, description, stock } = req.body;
        let imageUrl = null;

        if (req.file) {
            if (driver === 'local') {
                // multer.diskStorage already wrote the file to backend/uploads/
                imageUrl = `/uploads/${req.file.filename}`;
            } else {
                const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET)
                    .upload(fileName, req.file.buffer, {
                        contentType: req.file.mimetype
                    });

                if (uploadError) {
                    return res.status(500).json({ error: `Image upload failed: ${uploadError.message}` });
                }

                const { data: publicUrlData } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock),
                imageUrl
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    const take = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * take;
    const search = req.query.search || '';

    try {
        const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};

        const products = await prisma.product.findMany({ where, skip, take });
        const totalCount = await prisma.product.count({ where });

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalCount / take)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProductById(req, res) {
    try {
        const productId = req.params.id;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateProduct(req, res) {
    try {
        const productId = req.params.id;
        const productData = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) },
            data: productData
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;

        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(productId) }
        });

        // Best-effort cleanup: remove the image from Supabase Storage too,
        // so deleted products don't leave orphaned files in the bucket.
        // (Skipped for local driver — local files just sit in uploads/, harmless.)
        if (driver !== 'local' && deletedProduct.imageUrl) {
            const fileName = deletedProduct.imageUrl.split('/').pop();
            supabase.storage.from(BUCKET).remove([fileName]).catch(err =>
                console.error('Storage cleanup failed:', err.message)
            );
        }

        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};