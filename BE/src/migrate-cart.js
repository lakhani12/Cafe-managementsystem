import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from './config/db.js';
import { Cart } from './models/Cart.js';

async function migrateCarts() {
  try {
    await connectDatabase();

    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts to migrate`);

    for (const cart of carts) {
      let needsUpdate = false;

      // Check if any items are missing _id
      for (const item of cart.items) {
        if (!item._id) {
          // Generate a new ObjectId for this item
          item._id = new mongoose.Types.ObjectId();
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await cart.save();
        console.log(`Migrated cart ${cart._id}`);
      }
    }

    console.log('Cart migration complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrateCarts();
