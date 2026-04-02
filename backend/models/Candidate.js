import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true },
  resumeUrl: { type: String },
  notes: { type: String },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { 
    type: String, 
    enum: ['Applied', 'Called', 'Connected', 'Interested', 'Screening', 'Interviewing', 'Selected', 'Joined', 'Rejected'], 
    default: 'Applied' 
  },
  followupDate: { type: Date },
  referredBy: { type: String }, // To be linked to Agent/User model later
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
