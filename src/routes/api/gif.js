import express from 'express';
import { validate, Authenticate } from '../../middlewares';
import { GifController } from '../../controllers';

const { verifyToken } = Authenticate;
const { createGif } = GifController;

const router = express.Router();

/*
  @Description: endpoint users to create gif
  @Access: private authenticated users can create gif
  @Route: POST <domain>/api/v1/gifs
*/
router.post('/', validate('createGif'), verifyToken, createGif);

export default router;
