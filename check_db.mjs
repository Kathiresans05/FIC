import mongoose from 'mongoose';
import Candidate from './backend/models/Candidate.js';
import User from './backend/models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const candidateCount = await Candidate.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`Candidates: ${candidateCount}`);
    console.log(`Users: ${userCount}`);
    
    if (userCount > 0) {
      const agent = await User.findOne({ role: 'Agent' });
      if (agent) {
        console.log(`Agent: ${agent.name}, Joins: ${agent.joins}, Target: ${agent.monthlyTarget}`);
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDB();
