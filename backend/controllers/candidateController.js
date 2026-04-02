import Candidate from '../models/Candidate.js';

// @desc    Get all candidates
// @route   GET /api/candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('jobId').sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new candidate
// @route   POST /api/candidates
export const createCandidate = async (req, res) => {
  try {
    const newCandidate = await Candidate.create(req.body);
    res.status(201).json(newCandidate);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(k => error.errors[k].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Bulk create candidates
// @route   POST /api/candidates/bulk
export const bulkCreateCandidates = async (req, res) => {
  try {
    const candidates = req.body; // Expecting an array
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of candidates.' });
    }
    const newCandidates = await Candidate.insertMany(candidates);
    res.status(201).json({ 
      message: 'Bulk import successful', 
      count: newCandidates.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Bulk import failed', error: error.message });
  }
};

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
export const updateCandidate = async (req, res) => {
  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('jobId');
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};
