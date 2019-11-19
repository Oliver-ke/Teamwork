import {
  errorResponse, successResponse
} from '../utils';
import { uploadCloudinary } from '../services';
import {
  createItem, deleteItem, getItem, getItems
} from '../database/query/helper';


/**
 * @class UserController
 * @description Controller to manage user actions
 * @exports GifController
 */
export default class GifController {
  /**
  * @method createGif
  * @description - method for users to create gif
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
  static async createGif(req, res) {
    const { title, share } = req.body;
    const { userId: ownerId, firstName, lastName } = req.user;
    if (!req.files || !req.files.image) {
      return errorResponse(res, 400, 'Please provide an image');
    }
    const { image } = req.files;
    try {
      const { secure_url: secureUrl } = await uploadCloudinary(image);
      const { error, result: newGif } = await createItem('gifs', {
        title,
        ownerId,
        share: share === 'false' ? share : true,
        imageUrl: secureUrl,
        authorName: `${firstName} ${lastName}`
      });
      if (!error) {
        return successResponse(res, 201, 'Gif created successfuly', newGif);
      }
      return errorResponse(res, 500, 'Server error');
    } catch (error) {
      return errorResponse(res, 500, 'Internal server error');
    }
  }


  /**
* @method getgif
* @description - method to get all articles
* @param {object} req - request object
* @param {object} res - response object
* @return {object} request response body
*/
  static async getGif(req, res) {
    try {
      const { id } = req.params;
      const { error, result: gif } = await getItem('gifs', { id });
      const { result: commentArr } = await getItems('comments', { postId: id });
      if (!error) {
        const response = { ...gif, comments: commentArr };
        return successResponse(res, 200, 'Gif posts', response);
      }
      return errorResponse(res, 500, 'Server error geting items');
    } catch (error) {
      return errorResponse(res, 500, 'Server error');
    }
  }

  /**
  * @method deleteGif
  * @description - method for users to delete an existing gif
  * @param {object} req - request object
  * @param {object} res - response object
  * @return {object} request response body
  */
  static async deleteGif(req, res) {
    try {
      const { userId } = req.user;
      const { id: gifId } = req.params;
      const { result: gif } = await getItem('gifs', { id: gifId });
      if (!gif) return errorResponse(res, 404, 'Gif not found');
      if (gif.ownerId !== userId) {
        return errorResponse(res, 403, 'Not allowed');
      }
      const { result: deleted } = await deleteItem('gifs', gifId);
      if (deleted) return successResponse(res, 200, 'gif post successfully deleted');
      return errorResponse(res, 500, 'Server error deleting article');
    } catch (error) {
      return errorResponse(res, 500, 'internal server error');
    }
  }

  /**
 * @method commentArticle
 * @description - method for users to comment on a gif
 * @param {object} req - request object
 * @param {object} res - response object
 * @return {object} request response body
 */
  static async commentGif(req, res) {
    const { userId: ownerId, firstName, lastName } = req.user;
    try {
      const { id: gifId } = req.params;
      const { comment } = req.body;
      const { result: gif } = await getItem('gifs', { id: gifId });
      if (!gif) {
        return errorResponse(res, 404, 'No article found');
      }
      const { error, result: newComment } = await createItem('comments', {
        comment,
        ownerId,
        authorName: `${firstName} ${lastName}`,
        postId: gifId
      });
      const response = {
        ...newComment,
        gifTitle: gif.title,
      };
      if (!error) {
        return successResponse(res, 201, 'Comment successfully created”', response);
      }
      throw new Error(error);
    } catch (error) {
      console.log(error);
      return errorResponse(res, 500, 'internal server error');
    }
  }
}
