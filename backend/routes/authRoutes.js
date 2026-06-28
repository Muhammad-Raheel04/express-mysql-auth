import express from 'express';
import { login, register, verify } from '../controllers/authController.js';
import { validateRegister } from '../middlewares/registerValidator.js';
const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/verify', verify);
router.get('/login', login);

export default router;