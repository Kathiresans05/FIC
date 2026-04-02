import express from 'express';
import { getInterviews, scheduleInterview, updateInterviewStatus } from '../controllers/interviewController.js';

const router = express.Router();

router.get('/', getInterviews);
router.post('/', scheduleInterview);
router.patch('/:id/status', updateInterviewStatus);

export default router;
