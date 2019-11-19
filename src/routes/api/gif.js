import express from 'express';
import { validate, Authenticate } from '../../middlewares';
import { GifController } from '../../controllers';

const { verifyToken } = Authenticate;
const {
  createGif, deleteGif, commentGif, getGif
} = GifController;

const router = express.Router();

/*
  @Description: endpoint users to create gif
  @Access: private authenticated users can create gif
  @Route: POST <domain>/api/v1/gifs
*/
router.post('/', validate('createGif'), verifyToken, createGif);


/*
  @Description: endpoint users get specific gif
  @Access: private authenticated users get specific gif
  @Route: GET <domain>/api/v1/gifs/>id>
*/
router.get('/:id', verifyToken, getGif);


/*
  @Description: endpoint users to delete gif
  @Access: private only authenticated users can deleted their  gif
  @Route: DELETE <domain>/api/v1/gifs/<:id>
*/
router.delete('/:id', verifyToken, deleteGif);


/*
  @Description: endpoint for user to comment on a gif
  @Access: private only authenticated users can comment
  @Route: POST <domain>/api/v1/gifs/<:id>/comment
*/
router.post('/:id/comment', validate('comment'), verifyToken, commentGif);

export default router;
