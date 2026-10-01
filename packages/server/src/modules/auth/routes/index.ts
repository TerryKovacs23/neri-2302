import { Router } from 'express';
import { createUser } from '../controllers/index.js';

const authRouter = Router();

authRouter.post('/register', createUser);

export default authRouter;
