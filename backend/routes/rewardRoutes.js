import express from 'express';
import { getRewards, createReward, updateReward, deleteReward } from '../controllers/rewardController.js';

const router = express.Router();

router.get('/', getRewards);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

export default router;
