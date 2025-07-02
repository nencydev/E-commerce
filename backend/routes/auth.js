import express from 'express';
import { register, login, logout, getAllUsers, deleteUser } from '../controllers/authController.js';
import upload from '../middleware/multer.js';

const router = express.Router();
router.post('/register', upload.single('photo'), register);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser)

export default router;
