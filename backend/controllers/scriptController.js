import Script from '../models/Script.js';

// @desc    Get all scripts
// @route   GET /api/scripts
export const getScripts = async (req, res) => {
  try {
    const scripts = await Script.find().sort({ updatedAt: -1 });
    res.status(200).json(scripts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new script
// @route   POST /api/scripts
export const createScript = async (req, res) => {
  try {
    const { name, category, language, assignedJobs, content, version } = req.body;
    
    const newScript = await Script.create({
      name,
      category,
      language,
      assignedJobs: assignedJobs || 'All',
      content,
      version: version || 'v1.0'
    });

    res.status(201).json(newScript);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(k => error.errors[k].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Delete a script
// @route   DELETE /api/scripts/:id
export const deleteScript = async (req, res) => {
  try {
    const script = await Script.findByIdAndDelete(req.params.id);
    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }
    res.status(200).json({ message: 'Script deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
