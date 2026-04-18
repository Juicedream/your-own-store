import { MONGO_URI } from '../config/envConfig.js';
import mongoose from 'mongoose';

export async function connectingDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected on MONGODB 🟢");
  } catch (err) {
    console.error("Error connecting to DB: ", err);
    process.exit(1);
  }
}

