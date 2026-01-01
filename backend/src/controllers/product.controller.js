const prisma = require('../db');

exports.getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        const where = {};

        if (category) {
            where.category = category;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (search) {
            where.OR = [
                { name: { contains: search } }, // Case-insensitive matching depends on DB collation usually, but Prisma default is usually case-insensitive for some adapters
                { description: { contains: search } },
                { brand: { contains: search } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, stock } = req.body;

        let imageUrl = req.body.imageUrl;
        let images = req.body.images ? JSON.parse(req.body.images) : [];

        // Handle uploaded files
        if (req.files && req.files.length > 0) {
            const uploadedUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

            // If main image URL not provided, use the first uploaded image
            if (!imageUrl) {
                imageUrl = uploadedUrls[0];
            }

            // Add uploaded images to the images array
            images = [...images, ...uploadedUrls];
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                brand,
                category,
                imageUrl,
                images, // JSON array
                stock: parseInt(stock) || 0
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, brand, category, imageUrl, images, stock } = req.body;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                brand,
                category,
                imageUrl,
                images,
                stock: parseInt(stock)
            }
        });

        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

exports.enhanceProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageService = require('../services/image.service');
        const enhancedPath = await imageService.enhanceImage(req.file.path);

        // Construct public URL
        const filename = require('path').basename(enhancedPath);
        const enhancedUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

        res.json({
            success: true,
            url: enhancedUrl,
            originalPath: req.file.path
        });

    } catch (error) {
        console.error('Enhancement error:', error);
        res.status(500).json({ message: 'Failed to enhance image', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};
