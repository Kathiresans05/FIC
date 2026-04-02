import express from 'express';
import { getUsers, createUser, updateUser, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
