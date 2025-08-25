import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clean existing data (optional - comment out if you want to preserve existing data)
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.room.deleteMany();
    await prisma.anoouncement.deleteMany();
    await prisma.oTP.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.image.deleteMany();
    await prisma.product.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.settings.deleteMany();

    // Hash password for users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create Settings
    const settings = await prisma.settings.create({
        data: {
            title: 'ShopQuest Marketplace',
            slug: 'shopquest-marketplace',
            metadata: JSON.stringify({
                description: 'Your favorite online marketplace',
                keywords: 'shop, marketplace, products'
            }),
            links: JSON.stringify({
                facebook: 'https://facebook.com/shopquest',
                twitter: 'https://twitter.com/shopquest',
                instagram: 'https://instagram.com/shopquest'
            }),
            logoDark: 'https://example.com/logo-dark.png',
            logoLight: 'https://example.com/logo-light.png',
            favicon: 'https://example.com/favicon.ico'
        }
    });

    // Create Users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'John Admin',
                email: 'admin@shopquest.com',
                hashedPassword,
                role: 'ADMIN',
                image: 'https://i.pravatar.cc/150?img=1'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Alice Smith',
                email: 'alice@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=2'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Bob Johnson',
                email: 'bob@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=3'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Carol Davis',
                email: 'carol@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=4'
            }
        }),
        prisma.user.create({
            data: {
                name: 'David Wilson',
                email: 'david@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=5'
            }
        })
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Additional Users
    const moreUsers = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Eve Miller',
                email: 'eve@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=1'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Frank Thomas',
                email: 'frank@example.com',
                hashedPassword,
                role: 'USER',
                image: 'https://i.pravatar.cc/150?img=1'
            }
        })
    ]);
    console.log(`✅ Created additional ${moreUsers.length} users`);

    // Create Categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Electronics',
                description: 'Computers, phones, and electronic gadgets',
                icon: 'https://example.com/icons/electronics.png',
                color: '#3B82F6',
                slug: 'electronics'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Clothing',
                description: 'Fashion and apparel for all ages',
                icon: 'https://example.com/icons/clothing.png',
                color: '#EC4899',
                slug: 'clothing'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Home & Garden',
                description: 'Furniture, decor, and garden supplies',
                icon: 'https://example.com/icons/home.png',
                color: '#10B981',
                slug: 'home-garden'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Sports & Outdoors',
                description: 'Sports equipment and outdoor gear',
                icon: 'https://example.com/icons/sports.png',
                color: '#F59E0B',
                slug: 'sports-outdoors'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Books',
                description: 'Books, magazines, and educational materials',
                icon: 'https://example.com/icons/books.png',
                color: '#8B5CF6',
                slug: 'books'
            }
        })
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create Tags
    const tags = await Promise.all([
        prisma.tag.create({ data: { name: 'Popular' } }),
        prisma.tag.create({ data: { name: 'New Arrival' } }),
        prisma.tag.create({ data: { name: 'Sale' } }),
        prisma.tag.create({ data: { name: 'Featured' } }),
        prisma.tag.create({ data: { name: 'Limited Edition' } }),
        prisma.tag.create({ data: { name: 'Best Seller' } }),
        prisma.tag.create({ data: { name: 'Eco-Friendly' } })
    ]);

    console.log(`✅ Created ${tags.length} tags`);

    // Create Products with Images
    const products = [];

    // Electronics Products
    const laptop = await prisma.product.create({
        data: {
            name: 'MacBook Pro 16-inch',
            price: 2499.99,
            description: 'Powerful laptop with M2 Pro chip, perfect for professionals and creators.',
            sellerId: users[1].id,
            categoryId: categories[0].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[0].id },
                    { id: tags[5].id }
                ]
            }
        }
    });
    products.push(laptop);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=1', alt: 'MacBook Pro front view', productId: laptop.id },
            { url: 'https://picsum.photos/800/600?random=2', alt: 'MacBook Pro side view', productId: laptop.id },
            { url: 'https://picsum.photos/800/600?random=3', alt: 'MacBook Pro keyboard detail', productId: laptop.id }
        ]
    });

    const smartphone = await prisma.product.create({
        data: {
            name: 'iPhone 15 Pro',
            price: 1199.99,
            description: 'Latest iPhone with titanium design and advanced camera system.',
            sellerId: users[2].id,
            categoryId: categories[0].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[1].id },
                    { id: tags[0].id }
                ]
            }
        }
    });
    products.push(smartphone);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=4', alt: 'iPhone 15 Pro front view', productId: smartphone.id },
            { url: 'https://picsum.photos/800/600?random=5', alt: 'iPhone 15 Pro back view', productId: smartphone.id }
        ]
    });

    const headphones = await prisma.product.create({
        data: {
            name: 'Sony WH-1000XM5 Headphones',
            price: 399.99,
            description: 'Premium noise-canceling wireless headphones with exceptional sound quality.',
            sellerId: users[3].id,
            categoryId: categories[0].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[2].id },
                    { id: tags[5].id }
                ]
            }
        }
    });
    products.push(headphones);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=6', alt: 'Sony headphones main view', productId: headphones.id },
            { url: 'https://picsum.photos/800/600?random=7', alt: 'Sony headphones detail', productId: headphones.id }
        ]
    });

    // Clothing Products
    const jacket = await prisma.product.create({
        data: {
            name: 'Premium Leather Jacket',
            price: 299.99,
            description: 'Genuine leather jacket with modern cut and premium finish.',
            sellerId: users[1].id,
            categoryId: categories[1].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[3].id },
                    { id: tags[4].id }
                ]
            }
        }
    });
    products.push(jacket);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=8', alt: 'Leather jacket front view', productId: jacket.id },
            { url: 'https://picsum.photos/800/600?random=9', alt: 'Leather jacket back view', productId: jacket.id },
            { url: 'https://picsum.photos/800/600?random=10', alt: 'Leather jacket detail', productId: jacket.id }
        ]
    });

    const sneakers = await prisma.product.create({
        data: {
            name: 'Nike Air Max 270',
            price: 149.99,
            description: 'Comfortable running shoes with Air Max technology and stylish design.',
            sellerId: users[4].id,
            categoryId: categories[1].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[0].id },
                    { id: tags[2].id }
                ]
            }
        }
    });
    products.push(sneakers);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=11', alt: 'Nike sneakers side view', productId: sneakers.id },
            { url: 'https://picsum.photos/800/600?random=12', alt: 'Nike sneakers top view', productId: sneakers.id }
        ]
    });

    // Home & Garden Products
    const sofa = await prisma.product.create({
        data: {
            name: 'Modern 3-Seat Sofa',
            price: 899.99,
            description: 'Comfortable modern sofa with premium fabric upholstery, perfect for any living room.',
            sellerId: users[2].id,
            categoryId: categories[2].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[3].id },
                    { id: tags[6].id }
                ]
            }
        }
    });
    products.push(sofa);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=13', alt: 'Modern sofa front view', productId: sofa.id },
            { url: 'https://picsum.photos/800/600?random=14', alt: 'Modern sofa angle view', productId: sofa.id }
        ]
    });

    const plantPot = await prisma.product.create({
        data: {
            name: 'Ceramic Plant Pot Set',
            price: 49.99,
            description: 'Set of 3 elegant ceramic plant pots in different sizes, perfect for indoor plants.',
            sellerId: users[3].id,
            categoryId: categories[2].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[6].id },
                    { id: tags[1].id }
                ]
            }
        }
    });
    products.push(plantPot);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=15', alt: 'Ceramic plant pot set', productId: plantPot.id },
            { url: 'https://picsum.photos/800/600?random=16', alt: 'Plant pot detail view', productId: plantPot.id }
        ]
    });

    // Sports & Outdoors Products
    const bicycle = await prisma.product.create({
        data: {
            name: 'Mountain Bike Pro',
            price: 1299.99,
            description: 'Professional mountain bike with 21-speed transmission and durable aluminum frame.',
            sellerId: users[4].id,
            categoryId: categories[3].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[3].id },
                    { id: tags[5].id }
                ]
            }
        }
    });
    products.push(bicycle);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=17', alt: 'Mountain bike side view', productId: bicycle.id },
            { url: 'https://picsum.photos/800/600?random=18', alt: 'Mountain bike wheel detail', productId: bicycle.id },
            { url: 'https://picsum.photos/800/600?random=19', alt: 'Mountain bike gear system', productId: bicycle.id }
        ]
    });

    const tent = await prisma.product.create({
        data: {
            name: '4-Person Camping Tent',
            price: 199.99,
            description: 'Waterproof camping tent for 4 people with easy setup and excellent ventilation.',
            sellerId: users[1].id,
            categoryId: categories[3].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[2].id },
                    { id: tags[0].id }
                ]
            }
        }
    });
    products.push(tent);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=20', alt: 'Camping tent exterior', productId: tent.id },
            { url: 'https://picsum.photos/800/600?random=21', alt: 'Camping tent interior', productId: tent.id }
        ]
    });

    // Books Products
    const cookbook = await prisma.product.create({
        data: {
            name: 'Master Chef Cookbook',
            price: 29.99,
            description: 'Comprehensive cookbook with over 200 professional recipes and cooking techniques.',
            sellerId: users[2].id,
            categoryId: categories[4].id,
            stock: 10, // Add stock
            tags: {
                connect: [
                    { id: tags[5].id },
                    { id: tags[1].id }
                ]
            }
        }
    });
    products.push(cookbook);

    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=22', alt: 'Cookbook cover', productId: cookbook.id },
            { url: 'https://picsum.photos/800/600?random=23', alt: 'Cookbook inside pages', productId: cookbook.id }
        ]
    });

    // Append additional products:

    // Additional Product for Electronics
    const tablet = await prisma.product.create({
        data: {
            name: 'iPad Pro',
            price: 899.99,
            description: 'High performance tablet with advanced features.',
            sellerId: users[2].id,
            categoryId: categories[0].id,
            stock: 10, // Add stock
            tags: {
                connect: [{ id: tags[0].id }] // Popular
            }
        }
    });
    products.push(tablet);
    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=1', alt: 'iPad Pro front view', productId: tablet.id },
            { url: 'https://picsum.photos/800/600?random=2', alt: 'iPad Pro angle view', productId: tablet.id }
        ]
    });

    // Additional Product for Clothing
    const tshirt = await prisma.product.create({
        data: {
            name: 'Casual T-Shirt',
            price: 19.99,
            description: 'Comfortable cotton t-shirt available in various colors.',
            sellerId: users[3].id,
            categoryId: categories[1].id,
            stock: 10, // Add stock
            tags: {
                connect: [{ id: tags[2].id }] // Sale
            }
        }
    });
    products.push(tshirt);
    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=3', alt: 'T-shirt front view', productId: tshirt.id },
            { url: 'https://picsum.photos/800/600?random=4', alt: 'T-shirt back view', productId: tshirt.id }
        ]
    });

    // Additional Product for Home & Garden
    const coffeeTable = await prisma.product.create({
        data: {
            name: 'Modern Coffee Table',
            price: 199.99,
            description: 'Stylish coffee table with tempered glass top.',
            sellerId: users[1].id,
            categoryId: categories[2].id,
            stock: 10, // Add stock
            tags: {
                connect: [{ id: tags[3].id }] // Featured
            }
        }
    });
    products.push(coffeeTable);
    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=5', alt: 'Coffee table front view', productId: coffeeTable.id },
            { url: 'https://picsum.photos/800/600?random=6', alt: 'Coffee table side view', productId: coffeeTable.id }
        ]
    });

    // Additional Product for Sports & Outdoors
    const runningShoes = await prisma.product.create({
        data: {
            name: 'Adidas Running Shoes',
            price: 129.99,
            description: 'Lightweight and durable running shoes for daily workouts.',
            sellerId: users[2].id,
            categoryId: categories[3].id,
            stock: 10, // Add stock
            tags: {
                connect: [{ id: tags[0].id }] // Popular
            }
        }
    });
    products.push(runningShoes);
    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=7', alt: 'Running shoes front view', productId: runningShoes.id },
            { url: 'https://picsum.photos/800/600?random=8', alt: 'Running shoes side view', productId: runningShoes.id }
        ]
    });

    // Additional Product for Books
    const novel = await prisma.product.create({
        data: {
            name: 'Bestselling Novel',
            price: 14.99,
            description: 'A captivating novel that will keep you engaged till the end.',
            sellerId: users[4].id,
            categoryId: categories[4].id,
            stock: 10, // Add stock
            tags: {
                connect: [{ id: tags[1].id }] // New Arrival
            }
        }
    });
    products.push(novel);
    await prisma.image.createMany({
        data: [
            { url: 'https://picsum.photos/800/600?random=9', alt: 'Novel cover', productId: novel.id },
            { url: 'https://picsum.photos/800/600?random=10', alt: 'Novel back view', productId: novel.id }
        ]
    });

    console.log(`✅ Created ${products.length} products with images`);

    // Create Orders
    const orders = await Promise.all([
        prisma.order.create({
            data: {
                buyerId: users[1].id, // Alice
                total: 1799.98,
                status: 'DELIVERED',
                items: {
                    create: [
                        { productId: smartphone.id, quantity: 1, price: smartphone.price },
                        { productId: headphones.id, quantity: 1, price: headphones.price }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                buyerId: users[3].id, // Carol
                total: 449.98,
                status: 'SHIPPED',
                items: {
                    create: [
                        { productId: sneakers.id, quantity: 2, price: sneakers.price },
                        { productId: sneakers.id, quantity: 1, price: sneakers.price }
                    ]
                }
            }
        }),
        prisma.order.create({
            data: {
                buyerId: users[4].id, // David
                total: 2799.98,
                status: 'PENDING',
                items: {
                    create: [
                        { productId: laptop.id, quantity: 1, price: laptop.price },
                        { productId: jacket.id, quantity: 1, price: jacket.price }
                    ]
                }
            }
        })
    ]);

    console.log(`✅ Created ${orders.length} orders`);

    // Create Reviews
    const reviews = await Promise.all([
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Excellent laptop! Super fast and great display quality.',
                userId: users[3].id, // Carol
                productId: laptop.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Good phone, but battery could be better.',
                userId: users[4].id, // David
                productId: smartphone.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Best headphones I have ever owned. Amazing noise cancellation!',
                userId: users[1].id, // Alice
                productId: headphones.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 4,
                comment: 'Beautiful jacket, great quality leather.',
                userId: users[2].id, // Bob
                productId: jacket.id
            }
        }),
        prisma.review.create({
            data: {
                rating: 5,
                comment: 'Very comfortable sneakers, perfect for running.',
                userId: users[3].id, // Carol
                productId: sneakers.id
            }
        })
    ]);

    console.log(`✅ Created ${reviews.length} reviews`);

    // Create Notifications
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                userId: users[1].id, // Alice
                message: 'Your order has been shipped!',
                read: false
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[2].id, // Bob
                message: 'New review received for your product.',
                read: true
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[3].id, // Carol
                message: 'Your order has been delivered successfully.',
                read: false
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[4].id, // David
                message: 'Payment confirmation received.',
                read: true
            }
        })
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    // Create Chat Rooms and Messages
    const room1 = await prisma.room.create({
        data: {
            users: {
                connect: [
                    { id: users[1].id }, // Alice
                    { id: users[2].id }  // Bob
                ]
            }
        }
    });

    const room2 = await prisma.room.create({
        data: {
            users: {
                connect: [
                    { id: users[3].id }, // Carol
                    { id: users[4].id }  // David
                ]
            }
        }
    });

    const messages = await Promise.all([
        prisma.message.create({
            data: {
                content: 'Hi! Is the laptop still available?',
                senderId: users[1].id, // Alice
                roomId: room1.id
            }
        }),
        prisma.message.create({
            data: {
                content: 'Yes, it is! Would you like to know more about it?',
                senderId: users[2].id, // Bob
                roomId: room1.id
            }
        }),
        prisma.message.create({
            data: {
                content: 'Great! Can you tell me about the warranty?',
                senderId: users[1].id, // Alice
                roomId: room1.id
            }
        }),
        prisma.message.create({
            data: {
                content: 'Hello! I\'m interested in the camping tent.',
                senderId: users[3].id, // Carol
                roomId: room2.id
            }
        }),
        prisma.message.create({
            data: {
                content: 'Hi Carol! The tent is perfect for 4 people and very easy to set up.',
                senderId: users[4].id, // David
                roomId: room2.id
            }
        })
    ]);

    console.log(`✅ Created ${messages.length} messages in 2 chat rooms`);

    // Create Announcements
    const announcements = await Promise.all([
        prisma.anoouncement.create({
            data: {
                message: 'Welcome to ShopQuest! Explore our amazing products.',
                type: 'INFO'
            }
        }),
        prisma.anoouncement.create({
            data: {
                message: 'Flash Sale: 20% off on all electronics this weekend!',
                type: 'SUCCESS'
            }
        }),
        prisma.anoouncement.create({
            data: {
                message: 'Scheduled maintenance tonight from 2-4 AM EST.',
                type: 'WARNING'
            }
        })
    ]);

    console.log(`✅ Created ${announcements.length} announcements`);

    // Append additional seed data:
    // Create 50 extra users with emailVerified and unique avatars
    const extraUsersData = [];
    for (let i = 1; i <= 50; i++) {
        extraUsersData.push({
            name: `Extra User ${i}`,
            email: `extrauser${i}@example.com`,
            hashedPassword,
            role: 'USER',
            image: `https://i.pravatar.cc/150?img=${i + 10}`, // Unique avatar for each user
            emailVerified: new Date()
        });
    }

    const extraUsersResult = await prisma.user.createMany({
        data: extraUsersData
    });
    console.log(`✅ Created additional ${extraUsersResult.count} extra users`);

    // Create 250 extra products
    const extraProductsData = [];
    for (let i = 1; i <= 250; i++) {
        const categoryIndex = i % categories.length;
        const seller = users[i % users.length];
        extraProductsData.push({
            name: `Extra Product ${i}`,
            price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
            description: `Description for Extra Product ${i}`,
            sellerId: seller.id,
            categoryId: categories[categoryIndex].id,
            stock: Math.floor(Math.random() * 100) + 1 // Add random quantity between 1-100
        });
    }

    await prisma.product.createMany({
        data: extraProductsData
    });

    // Add 5-7 tags and 5-7 images to each extra product
    const extraProducts = await prisma.product.findMany({
        where: { name: { startsWith: "Extra Product" } }
    });

    await Promise.all(
        extraProducts.map(async (product) => {
            // Generate 5-7 random tags
            const numTags = Math.floor(Math.random() * 3) + 5; // Random number between 5-7
            const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
            const selectedTags = shuffledTags.slice(0, numTags);

            // Generate 5-7 images
            const numImages = Math.floor(Math.random() * 3) + 5; // Random number between 5-7
            const images = Array.from({ length: numImages }, (_, index) => ({
                url: `https://picsum.photos/800/600?random=${100 + index}`,
                alt: `Extra Product image ${index + 1} for ${product.name}`,
                productId: product.id
            }));

            // Update product with tags and images
            await Promise.all([
                prisma.product.update({
                    where: { id: product.id },
                    data: {
                        tags: {
                            connect: selectedTags.map(tag => ({ id: tag.id }))
                        }
                    }
                }),
                prisma.image.createMany({
                    data: images
                })
            ]);
        })
    );

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });