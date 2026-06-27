import express from 'express';
import { login, register } from '../controllers/authController.js';
import { validateRegister } from '../middlewares/registerValidator.js';
const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/login',login);

export default router;