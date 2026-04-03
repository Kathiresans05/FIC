import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './backend/.env' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'name email role password');
    console.log('--- User List ---');
    users.forEach(u => {
      console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | PWD: ${u.password ? 'Set' : 'Empty'}`);
    });
    console.log('-----------------');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
