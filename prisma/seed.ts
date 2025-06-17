import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient()

// Helper to generate Placeholder API URLs based on a keyword
// const placeholderImage = (keyword: string, i: number) => `https://placehold.co/600x600?text=${encodeURIComponent(keyword)}+${i + 1}`;

// Helper to generate Pexels image URLs based on a keyword
const placeholderImage = (keyword: string, i: number) => `https://images.pexels.com/photos/${1000000 + (i * 10)}/pexels-photo-${1000000 + (i * 10)}.jpeg?auto=compress&w=600&q=80&fit=crop&h=600&text=${encodeURIComponent(keyword)}`;

// Helper to get tag connectOrCreate array
const getTagConnect = (tagNames: string[]) => tagNames.map((name: string) => ({
    where: { name },
    create: { name },
}));

// 1. Clear all data before seeding (safe for dev)
async function clearAllData() {
    await prisma.notification.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.image.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
}

async function main() {
    await clearAllData();

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

    const alicePassword = await bcrypt.hash('alicepassword', 10);
    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            name: 'Alice',
            role: 'ADMIN',
            hashedPassword: alicePassword,
        },
    });
    const bobPassword = await bcrypt.hash('bobpassword', 10);
    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            email: 'bob@prisma.io',
            name: 'Bob',
            role: 'BUYER',
            hashedPassword: bobPassword,
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
                    { url: 'https://www.pexels.com/photo/person-in-yellow-jacket-taking-photo-in-the-forest-5048613/', alt: 'Smartphone' },
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

    // Update productsData to include tags
    const productsData = [
        {
            name: 'Wireless Headphones',
            price: 129.99,
            description: 'Noise-cancelling over-ear headphones',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: Array.from({ length: 5 }, (_, i) => placeholderImage('headphones', i)),
            tags: ['wireless', 'smart', 'gaming']
        },
        {
            name: 'Smart Watch',
            price: 199.99,
            description: 'Fitness tracking smart watch',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('smartwatch', i)),
            tags: ['smart', 'fitness', 'wireless']
        },
        {
            name: 'Bluetooth Speaker',
            price: 59.99,
            description: 'Portable Bluetooth speaker',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: [
                'https://images.pexels.com/photos/1034653/pexels-photo-1034653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
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
                'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg'
            ],
            tags: ['smart', 'gaming']
        },
        {
            name: 'Tablet',
            price: 399.99,
            description: '10-inch Android tablet',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('tablet', i)),
            tags: ['portable', 'smart']
        },
        {
            name: 'Gaming Mouse',
            price: 49.99,
            description: 'Ergonomic gaming mouse',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('gaming mouse', i)),
            tags: ['gaming', 'wireless']
        },
        {
            name: 'Leather Jacket',
            price: 199.99,
            description: 'Genuine leather jacket',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg'
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
                'https://images.pexels.com/photos/4462782/pexels-photo-4462782.jpeg'
            ],
            tags: ['fashion', 'fitness']
        },
        {
            name: 'Backpack',
            price: 59.99,
            description: 'Waterproof travel backpack',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('backpack', i)),
            tags: ['fashion', 'outdoor']
        },
        {
            name: 'Sunglasses',
            price: 29.99,
            description: 'UV protection sunglasses',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('sunglasses', i)),
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Dress',
            price: 79.99,
            description: 'Elegant summer dress',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: [
                'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg'
            ],
            tags: ['fashion']
        },
        {
            name: 'Jeans',
            price: 59.99,
            description: 'Slim fit blue jeans',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('blue jeans', i)),
            tags: ['fashion']
        },
        {
            name: 'Handbag',
            price: 149.99,
            description: 'Designer leather handbag',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: Array.from({ length: 4 }, (_, i) => placeholderImage('leather handbag', i)),
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Watch',
            price: 249.99,
            description: 'Luxury wrist watch',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('luxury watch', i)),
            tags: ['fashion', 'accessory']
        },
        {
            name: 'Bluetooth Earbuds',
            price: 79.99,
            description: 'Wireless Bluetooth earbuds',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('bluetooth earbuds', i)),
            tags: ['wireless', 'smart']
        },
        {
            name: 'Fitness Tracker',
            price: 59.99,
            description: 'Waterproof fitness tracker',
            categoryId: electronics.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('fitness tracker', i)),
            tags: ['fitness', 'smart']
        },
        {
            name: 'Wireless Charger',
            price: 39.99,
            description: 'Fast wireless charger',
            categoryId: electronics.id,
            sellerId: alice.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('wireless charger', i)),
            tags: ['wireless', 'accessory']
        },
        {
            name: 'Graphic T-Shirt',
            price: 29.99,
            description: 'Cool graphic t-shirt',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('graphic t-shirt', i)),
            tags: ['fashion']
        },
        {
            name: 'Winter Coat',
            price: 249.99,
            description: 'Warm winter coat',
            categoryId: fashion.id,
            sellerId: alice.id,
            images: Array.from({ length: 4 }, (_, i) => placeholderImage('winter coat', i)),
            tags: ['fashion']
        },
        {
            name: 'Running Shorts',
            price: 24.99,
            description: 'Lightweight running shorts',
            categoryId: fashion.id,
            sellerId: bob.id,
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('running shorts', i)),
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
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('kettle kitchen', i)),
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Nonstick Frying Pan',
            price: 18.99,
            description: '28cm Nonstick Skillet with Lid',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('nonstick frying pan', i)),
            tags: ['kitchen']
        },
        {
            name: 'Automatic Coffee Maker',
            price: 59.99,
            description: '12-Cup Programmable Coffee Machine',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('coffee maker', i)),
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Air Fryer XL',
            price: 89.99,
            description: '5.8QT Large Air Fryer Oven',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('air fryer', i)),
            tags: ['kitchen', 'eco-friendly']
        },
        {
            name: 'Robot Vacuum Cleaner',
            price: 149.99,
            description: 'Smart Robotic Vacuum with WiFi',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('robot vacuum', i)),
            tags: ['home', 'cleaning']
        },
    ];
    const beautyHealthProducts = [
        {
            name: 'Facial Cleansing Brush',
            price: 19.99,
            description: 'Electric facial cleansing brush',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('facial cleansing brush', i)),
            tags: ['beauty', 'skincare']
        },
        {
            name: 'Makeup Brush Set',
            price: 29.99,
            description: 'Professional makeup brush set',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('makeup brush set', i)),
            tags: ['beauty', 'makeup']
        },
        {
            name: 'Hair Dryer',
            price: 39.99,
            description: '2200W Professional Hair Dryer',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('hair dryer', i)),
            tags: ['beauty', 'haircare']
        },
        {
            name: 'Electric Toothbrush',
            price: 49.99,
            description: 'Sonic electric toothbrush with timer',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('electric toothbrush', i)),
            tags: ['beauty', 'oral-care']
        },
        {
            name: 'Skincare Fridge',
            price: 99.99,
            description: 'Mini skincare fridge with mirror',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('skincare fridge', i)),
            tags: ['beauty', 'skincare']
        },
    ];
    const toysHobbiesProducts = [
        {
            name: 'Remote Control Car',
            price: 39.99,
            description: '1:18 Scale Remote Control Car',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('remote control car', i)),
            tags: ['toy', 'hobby']
        },
        {
            name: 'Building Blocks Set',
            price: 29.99,
            description: 'Creative building blocks set',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('building blocks', i)),
            tags: ['toy', 'educational']
        },
        {
            name: 'Puzzle Game',
            price: 19.99,
            description: '500-piece jigsaw puzzle',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('jigsaw puzzle', i)),
            tags: ['game', 'puzzle']
        },
        {
            name: 'Action Figure',
            price: 24.99,
            description: 'Collectible action figure',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('action figure', i)),
            tags: ['toy', 'collectible']
        },
        {
            name: 'Board Game',
            price: 34.99,
            description: 'Strategy board game for adults',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('board game', i)),
            tags: ['game', 'strategy']
        },
    ];
    const sportsOutdoorsProducts = [
        {
            name: 'Yoga Mat',
            price: 19.99,
            description: 'Non-slip yoga mat',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('yoga mat', i)),
            tags: ['fitness', 'yoga']
        },
        {
            name: 'Dumbbell Set',
            price: 49.99,
            description: 'Adjustable dumbbell set',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('dumbbell set', i)),
            tags: ['fitness', 'exercise']
        },
        {
            name: 'Treadmill',
            price: 299.99,
            description: 'Folding treadmill with incline',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('treadmill', i)),
            tags: ['fitness', 'exercise']
        },
        {
            name: 'Camping Tent',
            price: 89.99,
            description: 'Waterproof camping tent',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('camping tent', i)),
            tags: ['outdoor', 'camping']
        },
        {
            name: 'Hiking Backpack',
            price: 69.99,
            description: 'Lightweight hiking backpack',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('hiking backpack', i)),
            tags: ['outdoor', 'hiking']
        },
    ];
    const automobilesProducts = [
        {
            name: 'Car Phone Mount',
            price: 9.99,
            description: 'Universal car phone holder',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('car phone mount', i)),
            tags: ['car', 'accessory']
        },
        {
            name: 'Dash Cam',
            price: 49.99,
            description: '1080P Full HD dash cam',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('dash cam', i)),
            tags: ['car', 'accessory']
        },
        {
            name: 'OBD2 Scanner',
            price: 29.99,
            description: 'Car diagnostic tool',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('OBD2 scanner', i)),
            tags: ['car', 'accessory']
        },
        {
            name: 'Car Vacuum Cleaner',
            price: 39.99,
            description: 'Portable car vacuum cleaner',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('car vacuum cleaner', i)),
            tags: ['car', 'cleaning']
        },
        {
            name: 'Motorcycle Cover',
            price: 19.99,
            description: 'Waterproof motorcycle cover',
            images: Array.from({ length: 3 }, (_, i) => placeholderImage('motorcycle cover', i)),
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

    // Faker-based product seeding
    async function seedFakerProducts(
        category: { id: string },
        seller: { id: string },
        count: number = 20,
        tagPool: string[] = []
    ) {
        for (let i = 0; i < count; i++) {
            const name = faker.commerce.productName();
            const price = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
            const description = faker.commerce.productDescription();
            const keyword = name.split(' ')[0];
            const images = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, j) => placeholderImage(keyword, j));
            const tags = faker.helpers.arrayElements(tagPool, faker.number.int({ min: 1, max: 3 }));
            await prisma.product.create({
                data: {
                    name,
                    price,
                    description,
                    categoryId: category.id,
                    sellerId: seller.id,
                    imagesId: {
                        create: images.map((url, k) => ({ url, alt: `${name} Image ${k + 1}` })),
                    },
                    tags: {
                        connectOrCreate: getTagConnect(tags)
                    }
                },
            });
        }
    }

    // Example usage after categories and users are created:
    await seedFakerProducts(electronics, alice, 20, ['wireless', 'smart', 'gaming', 'portable']);
    await seedFakerProducts(fashion, bob, 20, ['fashion', 'accessory', 'fitness', 'outdoor']);
    if (createdCategories.length >= 5) {
        await seedFakerProducts(createdCategories[0], alice, 20, ['kitchen', 'eco-friendly']); // Home & Kitchen
        await seedFakerProducts(createdCategories[1], bob, 20, ['beauty', 'skincare']); // Beauty & Health
        await seedFakerProducts(createdCategories[2], alice, 20, ['gaming', 'outdoor']); // Toys & Hobbies
        await seedFakerProducts(createdCategories[3], bob, 20, ['fitness', 'outdoor']); // Sports & Outdoors
        await seedFakerProducts(createdCategories[4], alice, 20, ['car', 'accessory']); // Automobiles & Motorcycles
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