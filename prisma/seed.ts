import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Helper to get tag connectOrCreate array
const getTagConnect = (tagNames: string[]) => tagNames.map((name: string) => ({
    where: { name },
    create: { name },
}));

async function main() {
    const electronics = await prisma.category.upsert({
        where: { slug: 'electronics' },
        update: {},
        create: {
            name: 'Electronics',
            slug: 'electronics',
            description: 'Electronic gadgets and devices',
            icon: 'https://example.com/electronics-icon.png',
            color: '#1e90ff',
        },
    });
    const fashion = await prisma.category.upsert({
        where: { slug: 'fashion' },
        update: {},
        create: {
            name: 'Fashion',
            slug: 'fashion',
            description: 'Clothing and accessories',
            icon: 'https://example.com/fashion-icon.png',
            color: '#e75480',
        },
    });

    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            name: 'Alice',
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });
    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            email: 'bob@prisma.io',
            name: 'Bob',
            role: 'BUYER',
        },
    });

    await prisma.product.create({
        data: {
            name: 'Smartphone',
            price: 699.99,
            description: 'Latest model smartphone',
            categoryId: electronics.id,
            sellerId: alice.id,
            imagesId: {
                create: [
                    { url: 'https://img.freepik.com/free-photo/modern-smartphone-mockup-design_23-2149437077.jpg', alt: 'Smartphone' },
                ],
            },
            tags: {
                connectOrCreate: getTagConnect(['wireless', 'smart', 'portable'])
            }
        },
    });
    await prisma.product.create({
        data: {
            name: 'Designer T-Shirt',
            price: 49.99,
            description: 'Trendy designer t-shirt',
            categoryId: fashion.id,
            sellerId: bob.id,
            imagesId: {
                create: [
                    { url: 'https://example.com/tshirt.jpg', alt: 'T-Shirt' },
                ],
            },
            tags: {
                connectOrCreate: getTagConnect(['fashion', 'accessory'])
            }
        },
    });

    // Create tags
    const tagsData = [
        { name: 'wireless' },
        { name: 'fashion' },
        { name: 'kitchen' },
        { name: 'smart' },
        { name: 'portable' },
        { name: 'eco-friendly' },
        { name: 'gaming' },
        { name: 'fitness' },
        { name: 'beauty' },
        { name: 'outdoor' },
        { name: 'car' },
        { name: 'accessory' },
    ];
    for (const tag of tagsData) {
        await prisma.tag.upsert({
            where: { name: tag.name },
            update: {},
            create: { name: tag.name },
        });
    }

    // Example for the first two products
    await prisma.product.create({
        data: {
            name: 'Smartphone',
            price: 699.99,
            description: 'Latest model smartphone',
            categoryId: electronics.id,
            sellerId: alice.id,
            imagesId: {
                create: [
                    { url: 'https://img.freepik.com/free-photo/modern-smartphone-mockup-design_23-2149437077.jpg', alt: 'Smartphone' },
                ],
            },
            tags: {
                connectOrCreate: getTagConnect(['wireless', 'smart', 'portable'])
            }
        },
    });
    await prisma.product.create({
        data: {
            name: 'Designer T-Shirt',
            price: 49.99,
            description: 'Trendy designer t-shirt',
            categoryId: fashion.id,
            sellerId: bob.id,
            imagesId: {
                create: [
                    { url: 'https://example.com/tshirt.jpg', alt: 'T-Shirt' },
                ],
            },
            tags: {
                connectOrCreate: getTagConnect(['fashion', 'accessory'])
            }
        },
    });

    // Update productsData to include tags
    const productsData = [
        {
            name: 'Wireless Headphones',
            price: 129.99,
            description: 'Noise-cancelling over-ear headphones',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://example.com/headphones1.jpg',
                'https://example.com/headphones2.jpg',
                'https://example.com/headphones3.jpg',
                'https://example.com/headphones4.jpg',
                'https://example.com/headphones5.jpg',
            ],
            tags: ['wireless', 'smart', 'gaming']
        },
        {
            name: 'Smart Watch',
            price: 199.99,
            description: 'Fitness tracking smart watch',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: [
                'https://example.com/smartwatch1.jpg',
                'https://example.com/smartwatch2.jpg',
                'https://example.com/smartwatch3.jpg',
            ],
            tags: ['smart', 'fitness', 'wireless']
        },
        {
            name: 'Bluetooth Speaker',
            price: 59.99,
            description: 'Portable Bluetooth speaker',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://example.com/speaker1.jpg',
                'https://example.com/speaker2.jpg',
                'https://example.com/speaker3.jpg',
            ],
            tags: ['portable', 'wireless']
        },
        {
            name: 'Laptop',
            price: 999.99,
            description: 'High performance laptop',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: [
                'https://example.com/laptop1.jpg',
                'https://example.com/laptop2.jpg',
                'https://example.com/laptop3.jpg',
                'https://example.com/laptop4.jpg',
            ],
            tags: ['smart', 'gaming']
        },
        {
            name: 'Tablet',
            price: 399.99,
            description: '10-inch Android tablet',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://example.com/tablet1.jpg',
                'https://example.com/tablet2.jpg',
                'https://example.com/tablet3.jpg',
            ],
            tags: ['portable', 'smart']
        },
        {
            name: 'Gaming Mouse',
            price: 49.99,
            description: 'Ergonomic gaming mouse',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: [
                'https://example.com/mouse1.jpg',
                'https://example.com/mouse2.jpg',
                'https://example.com/mouse3.jpg',
            ],
            tags: ['gaming', 'wireless']
        },
        {
            name: 'Leather Jacket',
            price: 199.99,
            description: 'Genuine leather jacket',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://example.com/jacket1.jpg',
                'https://example.com/jacket2.jpg',
                'https://example.com/jacket3.jpg',
                'https://example.com/jacket4.jpg',
            ],
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Sneakers',
            price: 89.99,
            description: 'Comfortable running sneakers',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/sneakers1.jpg',
                'https://example.com/sneakers2.jpg',
                'https://example.com/sneakers3.jpg',
                'https://example.com/sneakers4.jpg',
                'https://example.com/sneakers5.jpg',
            ],
            tags: ['fashion', 'fitness']
        },
        {
            name: 'Backpack',
            price: 59.99,
            description: 'Waterproof travel backpack',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://example.com/backpack1.jpg',
                'https://example.com/backpack2.jpg',
                'https://example.com/backpack3.jpg',
            ],
            tags: ['fashion', 'outdoor']
        },
        {
            name: 'Sunglasses',
            price: 29.99,
            description: 'UV protection sunglasses',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/sunglasses1.jpg',
                'https://example.com/sunglasses2.jpg',
                'https://example.com/sunglasses3.jpg',
            ],
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Dress',
            price: 79.99,
            description: 'Elegant summer dress',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://example.com/dress1.jpg',
                'https://example.com/dress2.jpg',
                'https://example.com/dress3.jpg',
                'https://example.com/dress4.jpg',
            ],
            tags: ['fashion']
        },
        {
            name: 'Jeans',
            price: 59.99,
            description: 'Slim fit blue jeans',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/jeans1.jpg',
                'https://example.com/jeans2.jpg',
                'https://example.com/jeans3.jpg',
            ],
            tags: ['fashion']
        },
        {
            name: 'Handbag',
            price: 149.99,
            description: 'Designer leather handbag',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://example.com/handbag1.jpg',
                'https://example.com/handbag2.jpg',
                'https://example.com/handbag3.jpg',
                'https://example.com/handbag4.jpg',
            ],
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Watch',
            price: 249.99,
            description: 'Luxury wrist watch',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/watch1.jpg',
                'https://example.com/watch2.jpg',
                'https://example.com/watch3.jpg',
            ],
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Bluetooth Earbuds',
            price: 79.99,
            description: 'Wireless Bluetooth earbuds',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://example.com/earbuds1.jpg',
                'https://example.com/earbuds2.jpg',
                'https://example.com/earbuds3.jpg',
            ],
            tags: ['wireless', 'smart']
        },
        {
            name: 'Fitness Tracker',
            price: 59.99,
            description: 'Waterproof fitness tracker',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: [
                'https://example.com/fitnesstracker1.jpg',
                'https://example.com/fitnesstracker2.jpg',
                'https://example.com/fitnesstracker3.jpg',
            ],
            tags: ['fitness', 'smart']
        },
        {
            name: 'Wireless Charger',
            price: 39.99,
            description: 'Fast wireless charger',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://example.com/charger1.jpg',
                'https://example.com/charger2.jpg',
                'https://example.com/charger3.jpg',
            ],
            tags: ['wireless', 'accessory']
        },
        {
            name: 'Graphic T-Shirt',
            price: 29.99,
            description: 'Cool graphic t-shirt',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/graphictee1.jpg',
                'https://example.com/graphictee2.jpg',
                'https://example.com/graphictee3.jpg',
            ],
            tags: ['fashion']
        },
        {
            name: 'Winter Coat',
            price: 249.99,
            description: 'Warm winter coat',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://example.com/coat1.jpg',
                'https://example.com/coat2.jpg',
                'https://example.com/coat3.jpg',
                'https://example.com/coat4.jpg',
            ],
            tags: ['fashion']
        },
        {
            name: 'Running Shorts',
            price: 24.99,
            description: 'Lightweight running shorts',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: [
                'https://example.com/shorts1.jpg',
                'https://example.com/shorts2.jpg',
                'https://example.com/shorts3.jpg',
            ],
            tags: ['fitness', 'fashion']
        },
    ];

    for (const product of productsData) {
        await prisma.product.create({
            data: {
                name: product.name,
                price: product.price,
                description: product.description,
                categoryId: product.categoryId,
                sellerId: product.sellerId,
                imagesId: {
                    create: product.images.map((url, i) => ({ url, alt: `${product.name} Image ${i + 1}` })),
                },
                tags: {
                    connectOrCreate: getTagConnect(product.tags || [])
                }
            },
        });
    }

    const categories = [
        {
            name: 'Home & Kitchen',
            slug: 'home-kitchen',
            description: 'Home appliances and kitchenware',
            icon: 'https://ae01.alicdn.com/kf/Sa1b6e2e7e7e24e2e8a7e7e7e7e7e7e7e7/Home-Kitchen-Icon.png',
            color: '#ffb347',
        },
        {
            name: 'Beauty & Health',
            slug: 'beauty-health',
            description: 'Beauty products and health care',
            icon: 'https://ae01.alicdn.com/kf/Sb2b6e2e7e7e24e2e8a7e7e7e7e7e7e7e7/Beauty-Health-Icon.png',
            color: '#ff69b4',
        },
        {
            name: 'Toys & Hobbies',
            slug: 'toys-hobbies',
            description: 'Toys, games, and hobby items',
            icon: 'https://ae01.alicdn.com/kf/Sb3b6e2e7e7e24e2e8a7e7e7e7e7e7e7e7/Toys-Hobbies-Icon.png',
            color: '#87ceeb',
        },
        {
            name: 'Sports & Outdoors',
            slug: 'sports-outdoors',
            description: 'Sports equipment and outdoor gear',
            icon: 'https://ae01.alicdn.com/kf/Sb4b6e2e7e7e24e2e8a7e7e7e7e7e7e7e7/Sports-Outdoors-Icon.png',
            color: '#32cd32',
        },
        {
            name: 'Automobiles & Motorcycles',
            slug: 'automobiles-motorcycles',
            description: 'Car and motorcycle accessories',
            icon: 'https://ae01.alicdn.com/kf/Sb5b6e2e7e7e24e2e8a7e7e7e7e7e7e7e7/Automobiles-Motorcycles-Icon.png',
            color: '#ffa500',
        },
    ];

    const createdCategories = [];
    for (const cat of categories) {
        createdCategories.push(await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        }));
    }

    const homeKitchenProducts = [
        {
            name: 'Stainless Steel Electric Kettle',
            price: 24.99,
            description: '1.7L Fast Boil Electric Kettle',
            images: [
                'https://ae01.alicdn.com/kf/Hb1e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Electric-Kettle-1.jpg',
                'https://ae01.alicdn.com/kf/Hb1e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Electric-Kettle-2.jpg',
                'https://ae01.alicdn.com/kf/Hb1e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Electric-Kettle-3.jpg',
            ],
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Nonstick Frying Pan',
            price: 18.99,
            description: '28cm Nonstick Skillet with Lid',
            images: [
                'https://ae01.alicdn.com/kf/Hb2e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Frying-Pan-1.jpg',
                'https://ae01.alicdn.com/kf/Hb2e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Frying-Pan-2.jpg',
                'https://ae01.alicdn.com/kf/Hb2e2e7e7e7e24e2e8a7e7e7e7e7e7e7e7/Frying-Pan-3.jpg',
            ],
            tags: ['kitchen']
        },
        {
            name: 'Automatic Coffee Maker',
            price: 59.99,
            description: '12-Cup Programmable Coffee Machine',
            images: [
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/91QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Air Fryer XL',
            price: 89.99,
            description: '5.8QT Large Air Fryer Oven',
            images: [
                'https://m.media-amazon.com/images/I/71bKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81bKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/91bKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Robot Vacuum Cleaner',
            price: 149.99,
            description: 'Smart Robotic Vacuum with WiFi',
            images: [
                'https://m.media-amazon.com/images/I/71cKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81cKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/91cKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['home', 'cleaning']
        },
    ];
    const beautyHealthProducts = [
        {
            name: 'Facial Cleansing Brush',
            price: 19.99,
            description: 'Electric facial cleansing brush',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['beauty', 'skincare']
        },
        {
            name: 'Makeup Brush Set',
            price: 29.99,
            description: 'Professional makeup brush set',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['beauty', 'makeup']
        },
        {
            name: 'Hair Dryer',
            price: 39.99,
            description: '2200W Professional Hair Dryer',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['beauty', 'haircare']
        },
        {
            name: 'Electric Toothbrush',
            price: 49.99,
            description: 'Sonic electric toothbrush with timer',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['beauty', 'oral-care']
        },
        {
            name: 'Skincare Fridge',
            price: 99.99,
            description: 'Mini skincare fridge with mirror',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['beauty', 'skincare']
        },
    ];
    const toysHobbiesProducts = [
        {
            name: 'Remote Control Car',
            price: 39.99,
            description: '1:18 Scale Remote Control Car',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['toy', 'hobby']
        },
        {
            name: 'Building Blocks Set',
            price: 29.99,
            description: 'Creative building blocks set',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['toy', 'educational']
        },
        {
            name: 'Puzzle Game',
            price: 19.99,
            description: '500-piece jigsaw puzzle',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['game', 'puzzle']
        },
        {
            name: 'Action Figure',
            price: 24.99,
            description: 'Collectible action figure',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['toy', 'collectible']
        },
        {
            name: 'Board Game',
            price: 34.99,
            description: 'Strategy board game for adults',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['game', 'strategy']
        },
    ];
    const sportsOutdoorsProducts = [
        {
            name: 'Yoga Mat',
            price: 19.99,
            description: 'Non-slip yoga mat',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['fitness', 'yoga']
        },
        {
            name: 'Dumbbell Set',
            price: 49.99,
            description: 'Adjustable dumbbell set',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['fitness', 'exercise']
        },
        {
            name: 'Treadmill',
            price: 299.99,
            description: 'Folding treadmill with incline',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['fitness', 'exercise']
        },
        {
            name: 'Camping Tent',
            price: 89.99,
            description: 'Waterproof camping tent',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['outdoor', 'camping']
        },
        {
            name: 'Hiking Backpack',
            price: 69.99,
            description: 'Lightweight hiking backpack',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['outdoor', 'hiking']
        },
    ];
    const automobilesProducts = [
        {
            name: 'Car Phone Mount',
            price: 9.99,
            description: 'Universal car phone holder',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['car', 'accessory']
        },
        {
            name: 'Dash Cam',
            price: 49.99,
            description: '1080P Full HD dash cam',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['car', 'accessory']
        },
        {
            name: 'OBD2 Scanner',
            price: 29.99,
            description: 'Car diagnostic tool',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['car', 'accessory']
        },
        {
            name: 'Car Vacuum Cleaner',
            price: 39.99,
            description: 'Portable car vacuum cleaner',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['car', 'cleaning']
        },
        {
            name: 'Motorcycle Cover',
            price: 19.99,
            description: 'Waterproof motorcycle cover',
            images: [
                'https://m.media-amazon.com/images/I/61QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_SL1500_.jpg',
                'https://m.media-amazon.com/images/I/81QKQ9mwV7L._AC_SL1500_.jpg',
            ],
            tags: ['motorcycle', 'accessory']
        },
    ];

    const createdProducts = [];
    for (const product of productsData) {
        createdProducts.push(await prisma.product.create({
            data: {
                name: product.name,
                price: product.price,
                description: product.description,
                categoryId: product.categoryId,
                sellerId: product.sellerId,
                imagesId: {
                    create: product.images.map((url, i) => ({ url, alt: `${product.name} Image ${i + 1}` })),
                },
                tags: {
                    connectOrCreate: getTagConnect(product.tags || [])
                }
            },
        }));
    }

    for (const group of [
        { products: homeKitchenProducts, categoryIdx: 0, tags: ['kitchen', 'eco-friendly'] },
        { products: beautyHealthProducts, categoryIdx: 1, tags: ['beauty'] },
        { products: toysHobbiesProducts, categoryIdx: 2, tags: ['gaming', 'outdoor'] },
        { products: sportsOutdoorsProducts, categoryIdx: 3, tags: ['fitness', 'outdoor'] },
        { products: automobilesProducts, categoryIdx: 4, tags: ['car', 'accessory'] },
    ]) {
        for (const product of group.products) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    categoryId: createdCategories[group.categoryIdx].id,
                    sellerId: alice.id,
                    imagesId: {
                        create: product.images.map((url, i) => ({ url, alt: `${product.name} Image ${i + 1}` })),
                    },
                    tags: {
                        connectOrCreate: getTagConnect(product.tags || group.tags)
                    }
                },
            });
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })