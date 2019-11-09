import express from 'express';
import userRoute from './api/user';
import gifRoute from './api/gif';

const router = express.Router();

router.use('/auth', userRoute);
router.use('/gifs', gifRoute);

export default router;
