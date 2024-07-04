import { Router } from 'express';

import contactsRouter from './contacts.js';
import authRouters from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouters);

export default router;
