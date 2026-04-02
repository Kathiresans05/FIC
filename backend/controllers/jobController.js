import Job from '../models/Job.js';

// @desc    Get all active jobs
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    console.log('--- Incoming Job Creation Request ---');
    console.log('Payload:', JSON.stringify(req.body, null, 2));

    const newJob = await Job.create(req.body);
    console.log('✅ Job created successfully:', newJob._id);
    res.status(201).json(newJob);
  } catch (error) {
    console.error('❌ Job creation failed:', error.message);
    if (error.name === 'ValidationError') {
      const errorList = Object.keys(error.errors).map(k => error.errors[k].message);
      console.error('Validation Errors:', errorList.join(', '));
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errorList 
      });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// @desc    Update a job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    });
    
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json(updatedJob);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorList = Object.keys(error.errors).map(k => error.errors[k].message);
      return res.status(400).json({ message: 'Validation failed', errors: errorList });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
