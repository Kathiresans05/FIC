import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  experience: { type: String, required: true },
  category: { type: String, required: true },
  vacancies: { type: Number, default: 1 },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  incentive: { type: String, default: '0' },
  type: { type: String, default: 'Full Time' },
  status: { type: String, enum: ['Open', 'Closed', 'Paused', 'Hold'], default: 'Open' },
  description: { type: String },
  requirements: [String],
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
