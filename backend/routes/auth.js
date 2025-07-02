// Corrected routes/auth.js
import express from 'express';
import {
  register,
  login,
  logout,
  getAllUsers,
  deleteUser,
  updateUser
} from '../controllers/authController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', upload.single('photo'), register);  // ✅ keep only this
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', upload.single('photo'), updateUser);  // ✅ add multer for update

export default router;
