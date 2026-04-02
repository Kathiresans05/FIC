import express from 'express';
import { getScripts, createScript, deleteScript } from '../controllers/scriptController.js';

const router = express.Router();

router.get('/', getScripts);
router.post('/', createScript);
router.delete('/:id', deleteScript);

export default router;
