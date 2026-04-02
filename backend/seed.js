import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Forge India Tech',
    location: 'Bangalore',
    salary: '18-25 LPA',
    experience: '4-6 Years',
    category: 'Information Technology',
    description: 'Looking for a skilled MERN stack developer to join our elite team.',
    requirements: ['React', 'Node.js', 'MongoDB', 'AWS']
  },
  {
    title: 'HR Manager',
    company: 'Talent Scout Inc.',
    location: 'Mumbai',
    salary: '10-14 LPA',
    experience: '5-8 Years',
    category: 'Management',
    description: 'Lead recruitment and operations for a high-growth startup.',
    requirements: ['Talent Acquisition', 'Policy Design', 'Strong Communication']
  },
  {
    title: 'Business Development Associate',
    company: 'SalesForce Pro',
    location: 'Remote',
    salary: '6-8 LPA + Incentives',
    experience: '1-3 Years',
    category: 'Sales',
    description: 'Driving growth and managing client relationships in the fintech space.',
    requirements: ['Sales', 'Negotiation', 'CRM Tools']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing jobs to avoid duplicates for testing
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    await Job.insertMany(sampleJobs);
    console.log('Successfully seeded 3 sample jobs!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
