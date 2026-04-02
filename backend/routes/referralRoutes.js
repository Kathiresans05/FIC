import express from 'express';
import { 
  submitReferral, 
  getReferrals, 
  getReferralById, 
  updateReferralStatus 
} from '../controllers/referralController.js';

const router = express.Router();

router.get('/', getReferrals);
router.post('/', submitReferral);
router.get('/:id', getReferralById);
router.put('/:id/status', updateReferralStatus);

export default router;
