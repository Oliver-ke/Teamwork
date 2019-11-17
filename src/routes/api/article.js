import express from 'express';
import { validate, Authenticate } from '../../middlewares';
import { ArticleController } from '../../controllers';

const { verifyToken } = Authenticate;
const { createArticle, deleteArticle, getArticles } = ArticleController;

const router = express.Router();

/*
  @Description: endpoint users get all articles
  @Access: private authenticated users can create gif
  @Route: GET <domain>/api/v1/articles
*/
router.get('/', verifyToken, getArticles);

/*
  @Description: endpoint users to create article
  @Access: private authenticated users can create gif
  @Route: POST <domain>/api/v1/articles
*/
router.post('/', validate('createArticle'), verifyToken, createArticle);

/*
  @Description: endpoint users to delete article
  @Access: private only authenticated users can deleted their  aricle
  @Route: DELETE <domain>/api/v1/articles/<:id>
*/
router.delete('/:id', verifyToken, deleteArticle);

export default router;
