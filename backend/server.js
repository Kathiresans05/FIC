import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/db.js';
import jobRoutes from './routes/jobRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import userRoutes from './routes/userRoutes.js';
import scriptRoutes from './routes/scriptRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import incentiveRoutes from './routes/incentiveRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/incentives', incentiveRoutes);
app.use('/api/reports', reportRoutes);

// Dynamic Health Check Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.json({ 
    status: 'UP', 
    message: 'Forge India API is live!', 
    database: {
      provider: 'MongoDB Atlas',
      status: dbStatus
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health\n`);
});
