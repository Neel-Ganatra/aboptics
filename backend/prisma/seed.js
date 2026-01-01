const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
    {
        name: "Classic Aviator",
        description: "Timeless aviator sunglasses featuring a lightweight metal frame and UV-protected lenses. Perfect for any occasion.",
        price: 129,
        brand: "Ray-Ban",
        category: "Sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
            "https://plus.unsplash.com/premium_photo-1675806626574-569d80c35467?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 50
    },
    {
        name: "Modern Square",
        description: "Bold square frames that make a statement. Durable acetate construction with a premium finish.",
        price: 89,
        brand: "Vincent Chase",
        category: "Frames",
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 30
    },
    {
        name: "Round Gold",
        description: "Vintage-inspired round glasses with a delicate gold frame. Ideal for a sophisticated, intellectual look.",
        price: 149,
        brand: "John Jacobs",
        category: "Frames",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1617726330368-6c845e6922ca?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 25
    },
    {
        name: "Sport Elite",
        description: "High-performance sunglasses designed for active lifestyles. Polarized lenses and grip-enhanced frames.",
        price: 199,
        brand: "Oakley",
        category: "Sunglasses",
        imageUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 40
    },
    {
        name: "Cat Eye Chic",
        description: "Elegant cat-eye frames that add a touch of glamour. Available in tortoise shell and black.",
        price: 119,
        brand: "Vogue",
        category: "Frames",
        imageUrl: "https://images.unsplash.com/photo-1625591341337-b2488a7bde23?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1625591341337-b2488a7bde23?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 15
    },
    {
        name: "Blue Block Pro",
        description: "Advanced blue light blocking lenses to reduce eye strain from digital screens.",
        price: 69,
        brand: "Lenskart Blu",
        category: "Lenses",
        imageUrl: "https://images.unsplash.com/photo-1596541315843-c90a16ecb66b?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1596541315843-c90a16ecb66b?q=80&w=800&auto=format&fit=crop"
        ],
        stock: 100
    }
];

async function main() {
    console.log('Start seeding...');

    // Clear existing products to prevent duplicates and stale data
    await prisma.orderItem.deleteMany({}); // Delete dependent OrderItems first (constraints)
    await prisma.product.deleteMany({});

    for (const product of products) {
        const createdProduct = await prisma.product.create({
            data: product
        });
        console.log(`Created product with id: ${createdProduct.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
