import express from 'express';
import { validate, Authenticate } from '../../middlewares';
import { GifController } from '../../controllers';

const { verifyToken } = Authenticate;
const { createGif, deleteGif } = GifController;

const router = express.Router();

/*
  @Description: endpoint users to create gif
  @Access: private authenticated users can create gif
  @Route: POST <domain>/api/v1/gifs
*/
router.post('/', validate('createGif'), verifyToken, createGif);

/*
  @Description: endpoint users to delete gif
  @Access: private only authenticated users can deleted their  gif
  @Route: DELETE <domain>/api/v1/gifs/<:id>
*/
router.delete('/:id', verifyToken, deleteGif);

export default router;
