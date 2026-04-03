import Reward from '../models/Reward.js';

export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

export const createReward = async (req, res) => {
  try {
    const { title, criteria, targetValue, rewardDesc, eligibility } = req.body;
    
    if (!title || !criteria || !targetValue || !rewardDesc) {
      return res.status(400).json({ message: 'Title, Criteria, Target Value, and Reward Description are required' });
    }

    const newReward = new Reward({
      title,
      criteria,
      targetValue,
      rewardDesc,
      eligibility
    });

    await newReward.save();
    res.status(201).json({ message: 'Reward created successfully', reward: newReward });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reward', error: error.message });
  }
};

export const updateReward = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const { title, criteria, targetValue, rewardDesc, eligibility, status, achievers } = req.body;

    const reward = await Reward.findByIdAndUpdate(
      rewardId,
      { title, criteria, targetValue, rewardDesc, eligibility, status, achievers },
      { new: true, runValidators: true }
    );

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    res.status(200).json({ message: 'Reward updated successfully', reward });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reward', error: error.message });
  }
};

export const deleteReward = async (req, res) => {
  try {
    const rewardId = req.params.id;
    const reward = await Reward.findByIdAndDelete(rewardId);

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    res.status(200).json({ message: 'Reward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reward', error: error.message });
  }
};
