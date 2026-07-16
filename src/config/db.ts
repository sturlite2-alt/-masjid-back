import mongoose from 'mongoose';
import { seedDatabase } from './seeder';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/masjid-firdouse';
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000, // Timeout connection after 5 seconds instead of hanging
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial demo collections if empty
    await seedDatabase();
  } catch (error) {
    console.error('================================================================');
    console.error('❌ MONGODB CONNECTION ERROR:');
    console.error(`  ${(error as Error).message}`);
    console.error('  Please ensure either:');
    console.error('  1. Local MongoDB is running on port 27017');
    console.error('  2. OR MONGODB_URI is correctly set in backend/.env to your MongoDB Atlas cluster.');
    console.error('================================================================');
    
    // We do not crash the process immediately to let other endpoints (like /health) remain responsive,
    // but queries will reject with a connection error instead of hanging.
  }
};
