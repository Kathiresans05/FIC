import express from 'express';
import { exportData } from '../controllers/exportController.js';

const router = express.Router();

router.get('/', exportData);

export default router;
