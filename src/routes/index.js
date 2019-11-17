import express from 'express';
import userRoute from './api/user';
import gifRoute from './api/gif';
import articleRoute from './api/article';

const router = express.Router();

router.use('/auth', userRoute);
router.use('/gifs', gifRoute);
router.use('/articles', articleRoute);

export default router;
