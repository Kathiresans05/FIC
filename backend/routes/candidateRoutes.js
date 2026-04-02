import express from 'express';
import { getCandidates, createCandidate, bulkCreateCandidates, updateCandidate } from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', getCandidates);
router.post('/', createCandidate);
router.post('/bulk', bulkCreateCandidates);
router.put('/:id', updateCandidate);

export default router;
