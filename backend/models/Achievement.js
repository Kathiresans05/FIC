import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  milestone: { type: String, required: true },
  date: { type: String, required: true },
  rewardStatus: { 
    type: String, 
    enum: ['Pending', 'Claimed', 'Dispatched'], 
    default: 'Pending' 
  }
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
