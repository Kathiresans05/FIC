import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`\n🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: FIC\n`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Ensure your current IP address (0.0.0.0/0) is whitelisted in the MongoDB Atlas Network Access settings.\n`);
    // Do not exit process, let the health check report it
  }
};

export default connectDB;
