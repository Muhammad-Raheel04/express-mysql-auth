import express from 'express';
import { login, logout, refreshToken, register, verify } from '../controllers/authController.js';
import { validateRegister } from '../middlewares/registerValidator.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/verify', verify);
router.post('/logout', isAuthenticated, logout);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;