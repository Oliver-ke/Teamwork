import express from 'express';
import { Authenticate } from '../../middlewares';
import { FeedController } from '../../controllers';

const { verifyToken } = Authenticate;
const { getFeeds } = FeedController;

const router = express.Router();

/*
  @Description: endpoint users to get feeds
  @Access: private authenticated users can get feeds
  @Route: GET <domain>/api/v1/feeds
*/
router.get('/', verifyToken, getFeeds);

export default router;
