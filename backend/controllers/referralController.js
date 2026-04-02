import Candidate from '../models/Candidate.js';

// @desc    Submit a referral
// @route   POST /api/referrals
export const submitReferral = async (req, res) => {
  try {
    const newCandidate = await Candidate.create(req.body);
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all referrals
// @route   GET /api/referrals
export const getReferrals = async (req, res) => {
  try {
    const referrals = await Candidate.find().populate('jobId').sort({ createdAt: -1 });
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get referral by ID
// @route   GET /api/referrals/:id
export const getReferralById = async (req, res) => {
  try {
    const referral = await Candidate.findById(req.params.id).populate('jobId');
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    res.status(200).json(referral);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update referral status
// @route   PUT /api/referrals/:id/status
export const updateReferralStatus = async (req, res) => {
  try {
    const referral = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    res.status(200).json(referral);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
