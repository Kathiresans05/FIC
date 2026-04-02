import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Script name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Initial Calling', 'Follow-up', 'Interview Scheduling', 'WhatsApp Template', 'Objection Handling']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['English', 'Hindi', 'Bilingual (Hindi + English)']
  },
  assignedJobs: {
    type: String,
    default: 'All'
  },
  content: {
    type: String,
    required: [true, 'Script content is required']
  },
  version: {
    type: String,
    default: 'v1.0'
  }
}, {
  timestamps: true
});

const Script = mongoose.model('Script', scriptSchema);
export default Script;
