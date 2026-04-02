import express from 'express';
const router = express.Router();
import { getReportStats, exportReportData } from '../controllers/reportController.js';

router.get('/stats', getReportStats);
router.get('/export', exportReportData);

export default router;
