import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  criteria: {
    type: String,
    required: true,
  },
  targetValue: {
    type: Number,
    required: true,
  },
  rewardDesc: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  achievers: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);
export default Reward;
