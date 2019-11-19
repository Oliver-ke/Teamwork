import express from 'express';
import { validate, Authenticate } from '../../middlewares';
import { ArticleController } from '../../controllers';

const { verifyToken } = Authenticate;
const {
  createArticle, deleteArticle, getArticles, editArticle, commentArticle
} = ArticleController;

const router = express.Router();

/*
  @Description: endpoint users get all articles
  @Access: private authenticated users can create gif
  @Route: GET <domain>/api/v1/articles
*/
router.get('/', verifyToken, getArticles);

/*
  @Description: endpoint users to create article
  @Access: private authenticated users can create article
  @Route: POST <domain>/api/v1/articles
*/
router.post('/', validate('createArticle'), verifyToken, createArticle);

/*
  @Description: endpoint users edit their article post
  @Access: private only authenticated users can edit their apost
  @Route: PATCH <domain>/api/v1/articles/<articleId>
*/
router.patch('/:id', validate('createArticle'), verifyToken, editArticle);

/*
  @Description: endpoint users to delete article
  @Access: private only authenticated users can deleted their  aricle
  @Route: DELETE <domain>/api/v1/articles/<:id>
*/
router.delete('/:id', verifyToken, deleteArticle);

/*
  @Description: endpoint for user to comment on an article
  @Access: private only authenticated users can comment
  @Route: POST <domain>/api/v1/articles/<:id>/comment
*/
router.post('/:id/comment', validate('comment'), verifyToken, commentArticle);

export default router;
