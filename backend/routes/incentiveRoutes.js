import express from 'express';
const router = express.Router();
import { 
    getIncentiveRules, 
    createIncentiveRule, 
    updateIncentiveRule,
    deleteIncentiveRule,
    getPayouts, 
    updatePayoutStatus, 
    deletePayout 
} from '../controllers/incentiveController.js';

router.get('/rules', getIncentiveRules);
router.post('/rules', createIncentiveRule);
router.patch('/rules/:id', updateIncentiveRule);
router.delete('/rules/:id', deleteIncentiveRule);
router.get('/payouts', getPayouts);
router.patch('/payouts/:id', updatePayoutStatus);
router.delete('/payouts/:id', deletePayout);

export default router;
