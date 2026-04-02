import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';

// @desc    Export recruitment data as CSV
// @route   GET /api/export
export const exportData = async (req, res) => {
  try {
    const jobs = await Job.find();
    const candidates = await Candidate.find().populate('jobId');

    // Simple CSV construction for candidates
    let csv = 'Candidate Name,Email,Phone,Job Role,Status,Referred By,Applied Date\n';
    
    candidates.forEach(c => {
      csv += `${c.name},${c.email},${c.phone},${c.jobId?.title || 'N/A'},${c.status},${c.referredBy || 'N/A'},${c.createdAt}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('forge_india_recruitment_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
