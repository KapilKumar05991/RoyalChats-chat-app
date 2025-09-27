import { Router } from 'express';
import { login, me, register,logout } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authRouter = Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.get('/me',authMiddleware, me)

export default authRouter