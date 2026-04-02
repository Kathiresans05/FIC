import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['Admin', 'TeamMember', 'Agent', 'Super Admin', 'Recruitment Manager', 'Consultancy Executive'],
    required: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required']
  },
  location: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Verified', 'Pending', 'Inactive'],
    default: 'Active'
  },
  assignedJobs: {
    type: Number,
    default: 0
  },
  joins: {
    type: Number,
    default: 0
  },
  perf: {
    type: Number,
    default: 0
  },
  referrals: {
    type: Number,
    default: 0
  },
  converted: {
    type: Number,
    default: 0
  },
  earnings: {
    type: String,
    default: '0'
  },
  rating: {
    type: Number,
    default: 0
  },
  monthlyTarget: {
    type: Number,
    default: 20
  },
  avatar: {
    type: String,
    default: ''
  },
  twoFactor: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  payoutNotifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
