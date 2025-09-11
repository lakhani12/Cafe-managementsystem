import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import { User } from './models/User.js';
import { Product } from './models/Product.js';

async function seedUsers() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const userEmail = process.env.SEED_USER_EMAIL || 'user@example.com';
  const userPassword = process.env.SEED_USER_PASSWORD || 'User@12345';

  // Admin
  let admin = await User.findOne({ email: adminEmail }).select('+password');
  if (!admin) {
    admin = new User({
      name: 'Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    await admin.save();
    // eslint-disable-next-line no-console
    console.log(`Created admin: ${adminEmail}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Admin already exists: ${adminEmail}`);
  }

  // Default user
  let defaultUser = await User.findOne({ email: userEmail }).select('+password');
  if (!defaultUser) {
    defaultUser = new User({
      name: 'Default User',
      email: userEmail,
      password: userPassword,
      role: 'user',
    });
    await defaultUser.save();
    // eslint-disable-next-line no-console
    console.log(`Created user: ${userEmail}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`User already exists: ${userEmail}`);
  }
}

async function seedProducts() {
  const items = [
    {
      title: 'Espresso',
      description: 'Rich and bold single-shot espresso.',
      category: 'beverage',
      price: 2.5,
      inStock: 100,
      images: [],
    },
    {
      title: 'Cappuccino',
      description: 'Espresso with steamed milk and foam.',
      category: 'beverage',
      price: 3.5,
      inStock: 100,
      images: [],
    },
    {
      title: 'Latte',
      description: 'Smooth espresso with plenty of steamed milk.',
      category: 'beverage',
      price: 3.75,
      inStock: 100,
      images: [],
    },
    {
      title: 'Americano',
      description: 'Espresso diluted with hot water.',
      category: 'beverage',
      price: 3.0,
      inStock: 100,
      images: [],
    },
    {
      title: 'Mocha',
      description: 'Espresso, chocolate, and steamed milk.',
      category: 'beverage',
      price: 4.25,
      inStock: 100,
      images: [],
    },
    {
      title: 'Croissant',
      description: 'Buttery flaky pastry baked fresh daily.',
      category: 'bakery',
      price: 2.25,
      inStock: 50,
      images: [],
    },
    {
      title: 'Blueberry Muffin',
      description: 'Soft muffin packed with blueberries.',
      category: 'bakery',
      price: 2.0,
      inStock: 60,
      images: [],
    },
    {
      title: 'Chocolate Chip Cookie',
      description: 'Chewy cookie with chocolate chips.',
      category: 'bakery',
      price: 1.5,
      inStock: 120,
      images: [],
    },
    {
      title: 'Chicken Sandwich',
      description: 'Grilled chicken with lettuce and tomatoes.',
      category: 'food',
      price: 6.5,
      inStock: 40,
      images: [],
    },
    {
      title: 'Caesar Salad',
      description: 'Crisp romaine with parmesan and croutons.',
      category: 'food',
      price: 5.75,
      inStock: 35,
      images: [],
    },
  ];

  let created = 0;
  for (const item of items) {
    const exists = await Product.findOne({ title: item.title });
    if (!exists) {
      await Product.create(item);
      created += 1;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Products seeded. Created: ${created}, Skipped: ${items.length - created}`);
}

async function seed() {
  try {
    await connectDatabase();
    await seedUsers();
    await seedProducts();
    // eslint-disable-next-line no-console
    console.log('Seeding complete.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

seed();
