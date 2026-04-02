import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidate: {
    type: String,
    required: [true, 'Candidate name is required']
  },
  job: {
    type: String,
    required: [true, 'Job title is required']
  },
  date: {
    type: String,
    required: [true, 'Interview date is required']
  },
  time: {
    type: String,
    required: [true, 'Interview time is required']
  },
  type: {
    type: String,
    required: [true, 'Interview type is required'],
    enum: ['Video Call', 'Face to Face (F2F)', 'Telephonic']
  },
  mode: {
    type: String,
    required: [true, 'Meeting platform or venue is required']
  },
  interviewer: {
    type: String,
    required: [true, 'Interviewer name is required']
  },
  status: {
    type: String,
    default: 'Scheduled',
    enum: ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled', 'No Show']
  }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
