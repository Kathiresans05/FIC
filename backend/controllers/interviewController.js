import Interview from '../models/Interview.js';

// @desc    Get all interviews
// @route   GET /api/interviews
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: 1, time: 1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule a new interview
// @route   POST /api/interviews
export const scheduleInterview = async (req, res) => {
  try {
    const { candidate, job, date, time, type, mode, interviewer } = req.body;
    
    const newInterview = await Interview.create({
      candidate,
      job,
      date,
      time,
      type,
      mode,
      interviewer
    });

    res.status(201).json(newInterview);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(k => error.errors[k].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update interview status
// @route   PATCH /api/interviews/:id/status
export const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const interview = await Interview.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
